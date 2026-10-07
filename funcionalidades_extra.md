# Documentación de Funcionalidades Extra: CSV y Paginación

Este documento describe en detalle las funcionalidades adicionales que se han implementado en la aplicación **Agenda (NestJS)** para optimizar la gestión masiva de datos y la experiencia de usuario.

---

## 1. Exportación e Importación Masiva de Contactos (CSV)

Permite respaldar, migrar y cargar listas de contactos de forma ágil mediante archivos estándar `.csv`.

### 1.1 Exportación a CSV (`GET /contactos/exportar/csv`)
- **Funcionamiento:** Consulta todos los contactos en PostgreSQL mediante TypeORM y genera un archivo CSV con las columnas correspondientes.
- **Compatibilidad con tildes y caracteres especiales:** Se incluye la marca de orden de bytes **UTF-8 BOM (`\uFEFF`)** al inicio del archivo para garantizar que Microsoft Excel, LibreOffice Calc y Google Sheets abran los caracteres con tildes y la letra 'ñ' sin errores de codificación.
- **Cabeceras HTTP configuradas:**
  ```http
  Content-Type: text/csv; charset=utf-8
  Content-Disposition: attachment; filename="contactos.csv"
  ```
- **Estructura del archivo exportado:**
  ```csv
  ID,Nombre,Apellidos,Teléfono,Email
  1,"Carlos","Castaños","600123456","carlos@email.com"
  ```

### 1.2 Importación desde CSV (`POST /contactos/importar/csv`)
- **Procesamiento de subida:** Utiliza `FileInterceptor('archivo')` de `@nestjs/platform-express` para recibir el archivo subido desde el navegador en memoria (`file.buffer`).
- **Parser inteligente:**
  - Detecta automáticamente si la primera fila contiene encabezados (como *Nombre*, *Email*, *Teléfono*) para ignorarla.
  - Soporta campos delimitados por comas y valores con comillas escapadas (`"..."`).
  - Admite tanto formatos con columna `ID` previa como sin ella.
- **Inserción por lotes:** Valida que los campos obligatorios estén presentes e inserta los nuevos registros en la base de datos de forma masiva con `contactosRepository.save(nuevosContactos)`.
- **Interfaz de usuario:** Botón en la cabecera que despliega una ventana modal interactiva para seleccionar el archivo y muestra una alerta con el recuento de contactos importados.

---

## 2. Paginación y Ordenación por Columnas

Permite navegar de forma fluida por la lista de contactos sin sobrecargar el navegador ni la base de datos.

### 2.1 Paginación en Backend (`ContactosService.findPaginated`)
- **Parámetros aceptados:**
  - `page`: Número de página actual (por defecto `1`).
  - `limit`: Cantidad de elementos por página (configurable: `5`, `10`, `20`, `50`).
  - `search`: Término de búsqueda filtrado con `ILike` en PostgreSQL.
- **Consulta eficiente con TypeORM:**
  ```typescript
  const [contactos, total] = await this.contactoRepository.findAndCount({
    where,
    order: { [sortBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });
  ```
- **Cálculo dinámico:** Devuelve `totalPages`, `total`, `currentPage` e índices de registros mostrados.

### 2.2 Ordenación Interactiva (Sorting)
- **Columnas ordenables:** Contacto (`nombre`), Teléfono (`telefono`) y Email (`email`).
- **Alternancia automática:** Al hacer clic sobre cualquier cabecera de la tabla, se alterna el orden entre **Ascendente** (`▲`) y **Descendente** (`▼`), conservando los filtros y la página actual.

### 2.3 Controles de Paginación en la Vista (`inicio.ejs`)
- **Información contextual:** Muestra el rango visible (*"Mostrando 1 - 10 de 25 contactos"*).
- **Botones de navegación:** Botones de página *Anterior*, números de página con estado activo y botón *Siguiente*.
- **Selector dinámico de tamaño:** Menú desplegable para alternar entre 5, 10, 20 o 50 contactos por página.

---

## 3. Resumen de Archivos Modificados

| Archivo | Cambios principales |
| :--- | :--- |
| `src/contactos/contactos.service.ts` | Métodos `findPaginated()`, `exportarCSV()` e `importarCSV()`. |
| `src/contactos/contactos.controller.ts` | Endpoints `/exportar/csv`, `/importar/csv` con `FileInterceptor` y parámetros de consulta en `GET /contactos`. |
| `views/inicio.ejs` | Enlaces de ordenación en cabeceras, controles de paginación, selector de límite y modal de importación CSV. |
| `public/css/estilos.css` | Estilos para paginación, ordenación, ventana modal y botones de acción. |

---

## 4. Guía de Uso Rápido

1. **Exportar a CSV:** Pulsa en el botón **"Exportar CSV"** en la barra superior para descargar el archivo `contactos.csv`.
2. **Importar desde CSV:** Pulsa en **"Importar CSV"**, selecciona tu archivo `.csv` y pulsa **"Subir e Importar"**.
3. **Ordenar columnas:** Haz clic en los títulos de las columnas (**Contacto**, **Teléfono** o **Email**) para ordenar ascendente o descendentemente.
4. **Paginar:** Selecciona la cantidad de elementos en el desplegable *"Mostrar"* y utiliza los botones numéricos o *"Siguiente"* para navegar entre páginas.
