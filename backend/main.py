import os
import bcrypt
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel, EmailStr, Field
from typing import Literal

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


# --- Modelos de Pydantic ---
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
        print("Conexión a MongoDB establecida y índices asegurados.")
    except Exception as e:
        print(f"No se pudo conectar a MongoDB o crear índices: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Cierra la conexión a la base de datos al apagar la aplicación."""
    client.close()
    print("Conexión a MongoDB cerrada.")


# --- Endpoints de la API ---
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