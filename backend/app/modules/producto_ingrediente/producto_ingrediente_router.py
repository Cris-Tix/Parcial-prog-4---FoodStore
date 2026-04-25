from fastapi import APIRouter, status, Depends
from app.modules.producto_ingrediente.producto_ingrediente_service import ProductoIngredienteService
from app.modules.producto_ingrediente.producto_ingrediente_uow import ProductoIngredienteUnitOfWork
from app.modules.producto_ingrediente.producto_ingrediente_schema import (
    ProductoIngredienteCreate, ProductoIngredienteRead
)

producto_ingrediente_router = APIRouter(
    prefix="/producto-ingrediente",
    tags=["ProductoIngrediente"]
)


def get_service() -> ProductoIngredienteService:
    return ProductoIngredienteService(ProductoIngredienteUnitOfWork())


@producto_ingrediente_router.post("/", response_model=ProductoIngredienteRead, status_code=status.HTTP_201_CREATED)
def vincular(
    data: ProductoIngredienteCreate,
    service: ProductoIngredienteService = Depends(get_service)
):
    return service.vincular(data)


@producto_ingrediente_router.get("/producto/{producto_id}", response_model=list[ProductoIngredienteRead])
def por_producto(
    producto_id: int,
    service: ProductoIngredienteService = Depends(get_service)
):
    return service.listar_por_producto(producto_id)


@producto_ingrediente_router.get("/ingrediente/{ingrediente_id}", response_model=list[ProductoIngredienteRead])
def por_ingrediente(
    ingrediente_id: int,
    service: ProductoIngredienteService = Depends(get_service)
):
    return service.listar_por_ingrediente(ingrediente_id)


@producto_ingrediente_router.delete("/{producto_id}/{ingrediente_id}", status_code=status.HTTP_200_OK)
def desvincular(
    producto_id: int,
    ingrediente_id: int,
    service: ProductoIngredienteService = Depends(get_service)
):
    return service.desvincular(producto_id, ingrediente_id)
