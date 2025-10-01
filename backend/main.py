import os
import bcrypt
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Literal, List, Optional
from bson import ObjectId

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# --- Configuración de la App y Base de Datos ---
app = FastAPI(
    title="API de Recuerdos Eternos",
    description="Backend para gestionar productos y usuarios.",
    version="1.0.0",
)

MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = "recuerdos_eternos_db"

if not MONGO_URI:
    raise RuntimeError("La variable de entorno MONGODB_URI no está configurada.")

# Se recomienda crear el cliente una vez y reutilizarlo
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]
products_collection = db["products"]
settings_collection = db["settings"]


# --- Modelos de Pydantic ---

# --- Modelos de Configuración ---
class SettingsBase(BaseModel):
    heroImageUrl: Optional[HttpUrl] = None
    whatsappNumber: str
    heroTitle: str
    heroSubtitle: str
    address: str
    email: EmailStr

class SettingsUpdate(BaseModel):
    heroImageUrl: Optional[HttpUrl] = None
    whatsappNumber: Optional[str] = None
    heroTitle: Optional[str] = None
    heroSubtitle: Optional[str] = None
    address: Optional[str] = None
    email: Optional[EmailStr] = None

class SettingsOut(SettingsBase):
    id: str

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = {
            HttpUrl: lambda v: str(v) if v else None,
        }

# --- Modelos de Producto ---
class ProductBase(BaseModel):
    code: str = Field(..., description="Código único del producto.")
    description: str
    price: float = Field(..., gt=0, description="El precio debe ser mayor que cero.")
    availability: bool = True
    color: str
    tags: List[str] = []
    images: List[HttpUrl] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    availability: Optional[bool] = None
    color: Optional[str] = None
    tags: Optional[List[str]] = None
    images: Optional[List[HttpUrl]] = None

class ProductOut(ProductBase):
    id: str

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = {
            HttpUrl: lambda v: str(v),
        }

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Nombre de usuario único.")
    email: EmailStr = Field(..., description="Correo electrónico único.")
    password: str = Field(..., min_length=8, description="Contraseña de al menos 8 caracteres.")

class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: Literal["admin"]

    class Config:
        from_attributes = True


# --- Utilidades ---
def hash_password(password: str) -> str:
    """Hashea la contraseña usando bcrypt."""
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


# --- Eventos de Inicio y Cierre ---
@app.on_event("startup")
async def startup_db_client():
    """Crea índices únicos en la base de datos al iniciar la aplicación."""
    try:
        users_collection.create_index("username", unique=True)
        users_collection.create_index("email", unique=True)
        products_collection.create_index("code", unique=True)
        print("Conexión a MongoDB establecida y índices asegurados.")
    except Exception as e:
        print(f"No se pudo conectar a MongoDB o crear índices: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Cierra la conexión a la base de datos al apagar la aplicación."""
    client.close()
    print("Conexión a MongoDB cerrada.")


# --- Endpoints de la API ---

# --- Endpoints de Configuración ---
@app.get("/settings", response_model=SettingsOut, tags=["Settings"])
async def get_settings():
    settings = settings_collection.find_one()
    if settings is None:
        # Si no hay configuración, crea una por defecto
        default_settings = {
            "heroImageUrl": "https://images.unsplash.com/photo-1548681528-6a5c45b66b42",
            "whatsappNumber": "1234567890",
            "heroTitle": "Honrando su Memoria con Amor",
            "heroSubtitle": "Encuentra la ánfora perfecta para atesorar el recuerdo de tu fiel compañero.",
            "address": "123 Calle Falsa, Ciudad",
            "email": "info@recuerdoseternos.com",
        }
        settings_collection.insert_one(default_settings)
        settings = settings_collection.find_one()

    settings["id"] = str(settings["_id"])
    return SettingsOut.model_validate(settings)

@app.put("/settings", response_model=SettingsOut, tags=["Settings"])
async def update_settings(settings_update: SettingsUpdate):
    update_data = {k: v for k, v in settings_update.model_dump(exclude_unset=True).items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar.")

    updated_settings = settings_collection.find_one_and_update(
        {},
        {"$set": update_data},
        return_document=True,
        upsert=True  # Crea el documento si no existe
    )

    updated_settings["id"] = str(updated_settings["_id"])
    return SettingsOut.model_validate(updated_settings)


# --- Endpoints de Productos ---
@app.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED, tags=["Products"])
async def create_product(product: ProductCreate):
    product_data = product.model_dump(by_alias=True)
    try:
        result = products_collection.insert_one(product_data)
        created_product = products_collection.find_one({"_id": result.inserted_id})
        created_product["id"] = str(created_product["_id"])
        return ProductOut.model_validate(created_product)
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"El producto con el código '{product.code}' ya existe.")

@app.get("/products", response_model=List[ProductOut], tags=["Products"])
async def get_all_products():
    products = []
    for doc in products_collection.find():
        doc["id"] = str(doc["_id"])
        products.append(ProductOut.model_validate(doc))
    return products

@app.get("/products/{product_id}", response_model=ProductOut, tags=["Products"])
async def get_product_by_id(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="ID de producto no válido.")

    product = products_collection.find_one({"_id": ObjectId(product_id)})
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")

    product["id"] = str(product["_id"])
    return ProductOut.model_validate(product)

@app.put("/products/{product_id}", response_model=ProductOut, tags=["Products"])
async def update_product(product_id: str, product_update: ProductUpdate):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="ID de producto no válido.")

    update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar.")

    updated_product = products_collection.find_one_and_update(
        {"_id": ObjectId(product_id)},
        {"$set": update_data},
        return_document=True
    )

    if updated_product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")

    updated_product["id"] = str(updated_product["_id"])
    return ProductOut.model_validate(updated_product)

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Products"])
async def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="ID de producto no válido.")

    result = products_collection.delete_one({"_id": ObjectId(product_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")

    return None

# --- Endpoints de Usuarios ---
@app.post(
    "/users/admin",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Users"],
    summary="Crear un usuario administrador",
    description="Crea un nuevo usuario con el rol de 'admin'. El username y el email deben ser únicos."
)
async def create_admin_user(user: UserCreate):
    """
    Endpoint para crear un nuevo usuario administrador.
    """
    hashed_pass = hash_password(user.password)

    admin_user_data = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_pass,
        "role": "admin"
    }

    try:
        result = users_collection.insert_one(admin_user_data)

        # Obtenemos el documento recién creado para devolverlo
        created_user_doc = users_collection.find_one({"_id": result.inserted_id})

        if not created_user_doc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al crear el usuario después de la inserción."
            )

        # Mapeamos el documento a nuestro modelo de respuesta
        return UserOut(
            id=str(created_user_doc["_id"]),
            username=created_user_doc["username"],
            email=created_user_doc["email"],
            role=created_user_doc["role"],
        )

    except DuplicateKeyError as e:
        # Determinamos qué campo causó el conflicto
        conflicting_field = "username" if "username" in str(e) else "email"
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un usuario con este {conflicting_field}."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocurrió un error inesperado: {e}"
        )