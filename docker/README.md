# Directorio Docker

Este directorio contiene archivos de configuración adicionales para Docker.

## Estructura

```
docker/
├── README.md           # Este archivo
└── (vacío por ahora)
```

## Propósito

Este directorio está reservado para:

- Scripts de inicialización personalizados
- Configuraciones adicionales de Docker
- Archivos de configuración específicos del entorno
- Volúmenes montados (si es necesario en el futuro)

## Notas

- El frontend Vue.js no requiere configuraciones adicionales actualmente
- El backend (Laravel, MySQL, phpMyAdmin) está en un contenedor Docker separado
- La comunicación entre frontend y backend se realiza a través de la red `noname_network`

## Desarrollador

**Miguel Quesada Martinez**  
NoName Direct E-Commerce - Frontend
