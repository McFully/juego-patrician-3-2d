Objetivo del proyecto

El proyecto debe ser exclusivamente 2D. No debe existir ninguna dependencia, sistema, módulo, código, configuración, recurso, pipeline o referencia relacionada con renderizado 3D, motores 3D, escenas 3D, cámaras 3D, modelos 3D, materiales PBR, shaders 3D, iluminación volumétrica, mallas, esqueletos, animaciones 3D o cualquier tecnología asociada.

Referencia obligatoria

Tomar como referencia principal y estándar visual, arquitectónico y de implementación:

@stitch_hansa_vector_ui_implementation

Toda nueva implementación deberá alinearse con dicho referente en:

- Estilo visual.
- Organización de la interfaz.
- Arquitectura de renderizado.
- Flujo de trabajo.
- Sistema de assets.
- Rendimiento.
- Escalabilidad.
- Experiencia de usuario.

Limpieza completa del proyecto

Realizar una auditoría exhaustiva del árbol del proyecto y eliminar permanentemente cualquier elemento relacionado con el antiguo enfoque 3D.

Eliminar:

- Directorios de motores 3D.
- Sistemas de escena 3D.
- Renderizadores 3D.
- Cámaras 3D.
- Controladores de navegación 3D.
- Modelos 3D.
- Assets 3D.
- Shaders destinados a renderizado 3D.
- Herramientas de importación de modelos.
- Dependencias específicas de gráficos 3D.
- Configuraciones de físicas 3D.
- Sistemas de iluminación 3D.
- Sistemas de partículas diseñados para entornos 3D.
- Código muerto heredado del enfoque 3D.
- Documentación relacionada con el motor 3D anterior.
- Scripts de compilación específicos para componentes 3D.

Tras la limpieza no debe permanecer ninguna referencia residual al sistema anterior.

Arquitectura visual obligatoria

Todo el juego debe construirse mediante:

- Sprites 2D.
- Tiles 2D.
- Mapas vectoriales 2D.
- UI vectorial.
- Renderizado ortográfico puro.
- Capas 2D.
- Animaciones 2D.
- Efectos visuales 2D.

Prohibido:

- Perspectiva 3D.
- Cámaras libres.
- Objetos tridimensionales.
- Modelos extruidos.
- Terreno 3D.
- Render híbrido 2D/3D.
- Soluciones temporales basadas en 3D.

Estilo gráfico objetivo

El resultado visual debe aproximarse a una combinación de:

- Patrician III.
- Hansa clásica.
- Cartografía histórica europea.
- Interfaces vectoriales modernas.
- Juegos de estrategia económica premium.

Prioridades visuales:

- Máxima claridad.
- Excelente legibilidad.
- Aspecto profesional.
- Colores ricos y agradables.
- Gran densidad de información.
- Escalado perfecto en cualquier resolución.
- Excelente rendimiento incluso en mapas extensos.

Regla de implementación

Antes de crear cualquier sistema nuevo:

1. Verificar que sea completamente compatible con una arquitectura 100% 2D.
2. Verificar que siga los patrones definidos en @stitch_hansa_vector_ui_implementation.
3. Rechazar cualquier solución que requiera componentes 3D.
4. Mantener coherencia absoluta con el nuevo pipeline visual 2D.

Resultado esperado

Un proyecto limpio, coherente y mantenible basado íntegramente en tecnología 2D, sin restos del antiguo motor 3D, utilizando @stitch_hansa_vector_ui_implementation como referencia principal para toda la experiencia visual y técnica.