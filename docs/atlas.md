# ATLAS --- Instrucciones Maestras del Proyecto

## 1. Propósito

**ATLAS** es una aplicación interactiva de historia cuyo objetivo es
representar la historia de la humanidad como una red temporal,
geográfica, genealógica, política, cultural, tecnológica y causal.

No debe ser una simple enciclopedia ni una línea del tiempo
convencional.

Debe funcionar como una combinación de:

-   línea del tiempo interactiva;
-   árbol genealógico;
-   mapa histórico;
-   grafo de conocimiento;
-   atlas geográfico;
-   enciclopedia;
-   herramienta educativa;
-   sistema de exploración histórica.

La idea central es:

> **La historia no es una colección de fechas. Es una red de causas,
> consecuencias, decisiones, migraciones, ideas, conflictos,
> descubrimientos y personas conectadas a través del tiempo y el
> espacio.**

------------------------------------------------------------------------

# 2. Punto de partida

La primera versión de ATLAS comienza con:

> **El origen y desarrollo de la humanidad en la Tierra.**

El Big Bang, la formación del universo, las galaxias, el Sistema Solar y
la formación de la Tierra quedan fuera de la primera etapa.

En el futuro podrá existir una expansión independiente:

> **Historia del Universo**

que conecte con el origen de la humanidad.

El punto inicial de ATLAS será, por tanto, la historia biológica,
evolutiva y cultural que conduce a Homo sapiens y posteriormente a las
sociedades humanas.

------------------------------------------------------------------------

# 3. Principio fundamental

ATLAS debe representar la historia como un **grafo temporal dinámico**,
no como una línea única.

No asumir:

``` text
A → B → C → D
```

sino:

``` text
                 ┌── Civilización A
                 │
Origen ──────────┼── Civilización B
                 │
                 ├── Migración
                 │
                 ├── Tecnología
                 │
                 └── Civilización C
```

Cada acontecimiento puede tener:

-   antecedentes;
-   consecuencias;
-   acontecimientos contemporáneos;
-   influencias;
-   relaciones culturales;
-   relaciones económicas;
-   relaciones políticas;
-   relaciones tecnológicas;
-   relaciones geográficas;
-   relaciones demográficas;
-   relaciones genealógicas;
-   relaciones causales.

------------------------------------------------------------------------

# 4. Rol de la IA

La IA que participe en el proyecto debe actuar simultáneamente como:

## Historia

-   Historiador mundial.
-   Prehistoriador.
-   Arqueólogo.
-   Paleoantropólogo.
-   Historiador político.
-   Historiador militar.
-   Historiador económico.
-   Historiador social.
-   Historiador cultural.
-   Historiador de las religiones.
-   Historiador de la ciencia.
-   Historiador de la tecnología.
-   Historiador del arte.
-   Historiador de la arquitectura.
-   Historiador de la medicina.
-   Historiador de las migraciones.
-   Historiador de las relaciones internacionales.
-   Especialista en África.
-   Especialista en Medio Oriente.
-   Especialista en Asia.
-   Especialista en Europa.
-   Especialista en América.
-   Especialista en Mesoamérica.
-   Especialista en Sudamérica.
-   Especialista en Oceanía.

## Ciencias relacionadas

-   Paleoantropología.
-   Arqueología.
-   Genética de poblaciones.
-   Geografía histórica.
-   Paleoclimatología.
-   Lingüística histórica.
-   Epigrafía.
-   Numismática.
-   Paleografía.
-   Antropología.
-   Demografía histórica.

## Tecnología

-   Arquitectura de software.
-   Ingeniería full-stack.
-   Bases de datos.
-   Bases de datos de grafos.
-   Visualización de datos.
-   GIS.
-   Sistemas cartográficos.
-   Sistemas temporales.
-   UX/UI.
-   Diseño de productos educativos.
-   Inteligencia artificial.
-   Búsqueda semántica.

La IA debe pensar primero:

> **¿Cómo representamos correctamente el conocimiento histórico?**

Y después:

> **¿Cómo lo convertimos en software?**

------------------------------------------------------------------------

# 5. Responsabilidad histórica

ATLAS debe priorizar la precisión histórica sobre la espectacularidad
narrativa.

Reglas obligatorias:

1.  No inventar hechos.
2.  No rellenar huecos históricos con ficción presentada como realidad.
3.  No convertir hipótesis en hechos.
4.  No presentar una fecha aproximada como exacta.
5.  No presentar mitología como historia demostrada.
6.  No ocultar debates académicos relevantes.
7.  No fabricar genealogías.
8.  No crear relaciones causales sin evidencia o explicación.
9.  Diferenciar claramente evidencia, interpretación, hipótesis y
    tradición.
10. Cuando la evidencia sea insuficiente, decirlo explícitamente.

------------------------------------------------------------------------

# 6. Niveles de certeza

Cada elemento histórico debe poder clasificarse según su grado de
certeza.

### 🟢 Evidencia muy fuerte

Existe abundante evidencia arqueológica, documental, científica o
múltiple.

### 🔵 Evidencia fuerte

Existe evidencia suficiente, aunque haya debates menores.

### 🟡 Evidencia parcial

La interpretación es plausible, pero existe incertidumbre importante.

### 🟠 Controvertido

Existen interpretaciones académicas relevantes en conflicto.

### 🔴 Legendario / mitológico

Forma parte de una tradición, mito o relato cultural sin evidencia
histórica suficiente.

El sistema debe almacenar este nivel de certeza como parte del dato, no
únicamente como texto.

------------------------------------------------------------------------

# 7. Diferenciar mito e historia

Especialmente al trabajar con:

-   Sumeria.
-   Egipto.
-   Grecia.
-   Roma.
-   India.
-   China.
-   Mesoamérica.
-   Escandinavia.
-   religiones antiguas.

Cuando exista una tradición legendaria, utilizar formulaciones como:

> "Según la tradición..."

y explicar:

-   fuente;
-   fecha aproximada de la fuente;
-   distancia temporal respecto al acontecimiento;
-   evidencia arqueológica disponible;
-   interpretación de historiadores modernos.

No afirmar como hecho histórico algo que solo pertenece a una tradición.

------------------------------------------------------------------------

# 8. Cronología

ATLAS debe manejar:

-   millones de años;
-   cientos de miles de años;
-   miles de años;
-   siglos;
-   décadas;
-   años;
-   meses;
-   días.

Debe soportar:

-   fechas aproximadas;
-   intervalos;
-   períodos;
-   fechas antes de Cristo / después de Cristo;
-   BCE / CE;
-   rangos con incertidumbre.

Ejemplos:

``` text
≈ 300,000 años atrás
≈ 10,000 a.C.
≈ 3,500 a.C.
753 a.C.
44 a.C.
476 d.C.
1453
1492
1789
1914
1945
1969
2026
```

No todas las fechas tienen el mismo nivel de precisión.

------------------------------------------------------------------------

# 9. Escalas temporales

La interfaz debe adaptarse al nivel de zoom.

## Zoom amplio

Millones de años.

## Zoom medio

Miles de años.

## Zoom histórico

Siglos.

## Zoom detallado

Décadas, años, meses o días.

El usuario debe poder pasar de:

> Historia humana

a:

> Prehistoria

a:

> Neolítico

a:

> Mesopotamia

a:

> Sumeria

a:

> Uruk

a:

> un personaje

a:

> un acontecimiento concreto.

------------------------------------------------------------------------

# 10. Tipos de nodos

Todo elemento histórico relevante puede convertirse en un nodo.

Tipos mínimos:

-   Persona.
-   Pueblo.
-   Tribu.
-   Cultura.
-   Civilización.
-   Ciudad.
-   Reino.
-   Estado.
-   Imperio.
-   Dinastía.
-   Familia.
-   Batalla.
-   Guerra.
-   Tratado.
-   Migración.
-   Religión.
-   Idea.
-   Invención.
-   Tecnología.
-   Descubrimiento.
-   Obra.
-   Libro.
-   Documento.
-   Edificio.
-   Monumento.
-   Catástrofe.
-   Epidemia.
-   Revolución.
-   Movimiento.
-   Institución.
-   Ruta comercial.

Cada nodo debe poder contener:

-   nombre;
-   período;
-   fecha;
-   ubicación;
-   descripción;
-   categoría;
-   nivel de certeza;
-   fuentes;
-   imágenes;
-   relaciones;
-   acontecimientos relacionados.

------------------------------------------------------------------------

# 11. Tipos de relaciones

## Genealógicas

-   padre;
-   madre;
-   hijo;
-   hija;
-   hermano;
-   hermana;
-   matrimonio;
-   adopción;
-   descendencia;
-   dinastía.

## Políticas

-   gobernó;
-   sucedió;
-   derrocó;
-   conquistó;
-   fue vasallo;
-   alianza;
-   rebelión;
-   tratado.

## Militares

-   guerra;
-   batalla;
-   invasión;
-   conquista;
-   retirada;
-   derrota;
-   victoria.

## Geográficas

-   origen;
-   migración;
-   colonización;
-   expansión;
-   desplazamiento.

## Culturales

-   influencia;
-   transmisión;
-   adopción;
-   sincretismo;
-   intercambio.

## Económicas

-   comercio;
-   ruta comercial;
-   recurso;
-   moneda;
-   crisis.

## Tecnológicas

-   inventó;
-   desarrolló;
-   adoptó;
-   transmitió;
-   mejoró.

## Causales

-   antecedente;
-   causa;
-   consecuencia;
-   acelerador;
-   factor contribuyente.

La palabra **"causa"** debe utilizarse con cuidado. Los acontecimientos
históricos suelen tener múltiples factores.

------------------------------------------------------------------------

# 12. Causalidad histórica

ATLAS debe permitir investigar:

> **¿Por qué ocurrió esto?**

La respuesta debe separar:

1.  Contexto previo.
2.  Causas profundas.
3.  Factores estructurales.
4.  Causas inmediatas.
5.  Actores involucrados.
6.  Detonante.
7.  Desarrollo.
8.  Resultado.
9.  Consecuencias inmediatas.
10. Consecuencias de largo plazo.
11. Interpretaciones historiográficas.

Ejemplo:

``` text
Caída de Roma
    ├── factores políticos
    ├── factores militares
    ├── factores económicos
    ├── factores demográficos
    ├── conflictos internos
    ├── migraciones
    ├── presión fronteriza
    └── transformaciones administrativas
```

------------------------------------------------------------------------

# 13. "¿Qué pasaba en el mundo?"

Una función central de ATLAS debe ser:

> **¿QUÉ PASABA EN EL MUNDO?**

El usuario selecciona una fecha y obtiene una visión simultánea de
distintas regiones.

Ejemplo:

``` text
44 a.C.

ROMA
Asesinato de Julio César.

EGIPTO
Cleopatra VII.

CHINA
Dinastía Han.

INDIA
...

PERSIA
...

ÁFRICA
...

EUROPA
...

MESOAMÉRICA
...

ASIA ORIENTAL
...
```

El usuario debe poder cambiar de región manteniendo la fecha.

------------------------------------------------------------------------

# 14. "¿Por qué ocurrió?"

Cada evento importante debe tener una función:

> **¿POR QUÉ OCURRIÓ?**

Debe explicar:

-   contexto;
-   causas profundas;
-   causas inmediatas;
-   actores;
-   detonante;
-   desarrollo;
-   resultado;
-   consecuencias;
-   debates.

------------------------------------------------------------------------

# 15. "¿Qué cambió?"

Cada acontecimiento importante debe permitir:

> **¿QUÉ CAMBIÓ DESPUÉS DE ESTE EVENTO?**

Debe mostrar:

-   cambios inmediatos;
-   cambios institucionales;
-   cambios sociales;
-   cambios económicos;
-   cambios culturales;
-   cambios tecnológicos;
-   cambios geopolíticos;
-   consecuencias a largo plazo.

No atribuir a un único acontecimiento procesos que tuvieron múltiples
causas.

------------------------------------------------------------------------

# 16. Historia en paralelo

ATLAS debe permitir visualizar diferentes regiones simultáneamente.

Ejemplo:

``` text
────────────── 3000 a.C. ──────────────

MESOPOTAMIA     EGIPTO      INDUS      CHINA

Sumer           Egipto      Harappa    culturas
...
```

El usuario debe poder comparar desarrollos contemporáneos.

------------------------------------------------------------------------

# 17. Migraciones

Crear una capa específica para migraciones.

Debe representar:

-   origen;
-   destino;
-   período;
-   rutas probables;
-   evidencia;
-   incertidumbre.

No representar rutas exactas si la evidencia histórica o científica no
permite conocerlas.

------------------------------------------------------------------------

# 18. Mapa histórico

Integrar un sistema GIS capaz de cambiar según la fecha.

Debe mostrar, cuando exista información suficiente:

-   territorios;
-   ciudades;
-   fronteras;
-   rutas;
-   migraciones;
-   guerras;
-   comercio;
-   centros culturales.

Debe ser posible comparar:

``` text
500 a.C.
↓
300 a.C.
↓
100 a.C.
↓
117 d.C.
↓
395
↓
476
↓
565
↓
1000
↓
1453
```

------------------------------------------------------------------------

# 19. Genealogías

Crear un sistema genealógico independiente del resto del grafo.

Debe soportar:

-   familias;
-   casas reales;
-   dinastías;
-   matrimonios;
-   adopciones;
-   descendencia;
-   ramas secundarias;
-   hijos ilegítimos cuando sean históricamente relevantes;
-   coemperadores;
-   sucesiones.

Una genealogía no debe utilizarse para afirmar continuidad política
cuando no exista.

------------------------------------------------------------------------

# 20. Dinastías

Cada dinastía debe tener:

-   origen;
-   fundador;
-   miembros;
-   gobernantes;
-   fechas;
-   territorios;
-   matrimonios;
-   sucesiones;
-   guerras;
-   caída;
-   relaciones con otras dinastías.

------------------------------------------------------------------------

# 21. Civilizaciones

Cada civilización importante debe tener una ficha profunda.

Debe poder incluir:

-   geografía;
-   cronología;
-   ciudades;
-   organización política;
-   religión;
-   economía;
-   agricultura;
-   tecnología;
-   escritura;
-   arquitectura;
-   comercio;
-   guerra;
-   sociedad;
-   arte;
-   lengua;
-   personajes;
-   mitos;
-   fuentes;
-   descubrimientos arqueológicos;
-   influencia posterior.

------------------------------------------------------------------------

# 22. Historia mundial equilibrada

ATLAS NO debe convertirse en una historia centrada exclusivamente en
Europa.

Debe representar con profundidad:

-   África;
-   Medio Oriente;
-   Asia Central;
-   India;
-   China;
-   Japón;
-   Corea;
-   Sudeste Asiático;
-   Europa;
-   Mesoamérica;
-   Caribe;
-   Andes;
-   Norteamérica;
-   Oceanía.

Las civilizaciones deben aparecer según su desarrollo histórico, no
únicamente cuando entran en contacto con Europa.

------------------------------------------------------------------------

# 23. Personajes históricos

Cada personaje importante debe tener:

-   nombre;
-   variantes del nombre;
-   nacimiento;
-   muerte;
-   lugar;
-   familia;
-   cargos;
-   contemporáneos;
-   acontecimientos;
-   ideas;
-   obras;
-   enemigos;
-   aliados;
-   descendientes;
-   influencia;
-   controversias;
-   fuentes.

También debe existir una línea temporal personal.

------------------------------------------------------------------------

# 24. Viaje por una persona

Al seleccionar una persona, mostrar:

### Su vida

y simultáneamente:

### El mundo durante su vida.

Ejemplo:

``` text
VIDA DE JULIO CÉSAR

100 a.C. — nacimiento
      │
      ├── China: Dinastía Han
      ├── Egipto: Cleopatra
      ├── Persia: ...
      └── Mesoamérica: ...
```

La aplicación debe contextualizar siempre la vida de una persona dentro
de su época.

------------------------------------------------------------------------

# 25. Fuentes

Priorizar:

## Fuentes primarias

-   inscripciones;
-   manuscritos;
-   monedas;
-   cartas;
-   documentos;
-   crónicas;
-   restos arqueológicos;
-   monumentos.

## Fuentes secundarias

-   libros académicos;
-   artículos científicos;
-   universidades;
-   museos;
-   instituciones de investigación.

Diferenciar claramente:

> **Qué sabemos**

de:

> **Cómo lo interpretamos.**

------------------------------------------------------------------------

# 26. Controversias historiográficas

Cuando existan interpretaciones diferentes, no seleccionar
arbitrariamente una.

Mostrar:

### Interpretación A

...

### Interpretación B

...

### Evidencia disponible

...

### Consenso actual

...

Si no existe consenso:

> **No existe consenso académico.**

------------------------------------------------------------------------

# 27. Correlación histórica

ATLAS debe responder:

> **¿Cómo cambió el rumbo de la historia?**

Cada acontecimiento importante puede tener un mapa de impacto.

Ejemplo:

``` text
Escritura
    ├── administración
    ├── impuestos
    ├── comercio
    ├── leyes
    ├── religión
    ├── literatura
    ├── memoria histórica
    └── educación
```

Cada conexión debe estar respaldada y explicada.

------------------------------------------------------------------------

# 28. Conexiones de largo plazo

La aplicación debe permitir investigar:

> **¿Qué acontecimientos antiguos todavía tienen consecuencias en el
> mundo actual?**

Las cadenas históricas deben incluir los procesos intermedios y evitar
explicaciones excesivamente simplistas.

------------------------------------------------------------------------

# 29. Contrafactuales

ATLAS puede incorporar una función de historia contrafactual.

Ejemplos:

-   ¿Qué habría pasado si Roma no hubiera conquistado Grecia?
-   ¿Qué habría ocurrido si Julio César no hubiera sido asesinado?
-   ¿Qué habría ocurrido si Constantinopla no hubiera caído?

Pero siempre debe existir una separación visual inequívoca entre:

**HISTORIA DOCUMENTADA**

y

**ESCENARIO HIPOTÉTICO.**

Nunca mezclar ambos.

------------------------------------------------------------------------

# 30. Profundidad de información

La información debe tener niveles.

## Nivel 1 --- Resumen

Aproximadamente 30 segundos.

## Nivel 2 --- Explicación

3--5 minutos.

## Nivel 3 --- Profundización

10--20 minutos.

## Nivel 4 --- Investigación

Fuentes, debates, cronologías, evidencia y bibliografía.

Esto permitirá que la aplicación sirva tanto al usuario casual como al
usuario que desea estudiar profundamente.

------------------------------------------------------------------------

# 31. Alimentación progresiva de la historia

Esta es una regla estructural fundamental.

ATLAS no debe intentar contener toda la historia desde el primer día.

Debe construirse para crecer progresivamente.

El sistema debe permitir agregar sin modificar la arquitectura
principal:

-   nuevos eventos;
-   nuevas personas;
-   nuevas civilizaciones;
-   nuevas fuentes;
-   nuevas relaciones;
-   nuevas genealogías;
-   nuevas interpretaciones;
-   nueva evidencia;
-   nuevos mapas.

------------------------------------------------------------------------

# 32. Proceso para incorporar cada acontecimiento

Cada nuevo hecho histórico debe seguir este procedimiento:

### Paso 1 --- Identificar

¿Qué ocurrió?

### Paso 2 --- Fechar

¿Cuándo ocurrió?

### Paso 3 --- Localizar

¿Dónde ocurrió?

### Paso 4 --- Actores

¿Quiénes participaron?

### Paso 5 --- Contexto

¿Qué estaba ocurriendo antes?

### Paso 6 --- Causas

¿Qué factores contribuyeron?

### Paso 7 --- Contemporáneos

¿Qué estaba ocurriendo simultáneamente en otras regiones?

### Paso 8 --- Desarrollo

¿Cómo ocurrió?

### Paso 9 --- Consecuencias

¿Qué cambió inmediatamente?

### Paso 10 --- Largo plazo

¿Qué efectos tuvo posteriormente?

### Paso 11 --- Conexiones

¿Qué otros nodos deben conectarse?

### Paso 12 --- Evidencia

¿Qué fuentes respaldan la información?

### Paso 13 --- Certeza

¿Qué tan segura es la interpretación?

------------------------------------------------------------------------

# 33. Regla de enriquecimiento

No agregar solamente fechas.

Por ejemplo, no registrar simplemente:

> 44 a.C. --- Julio César fue asesinado.

Debe convertirse en una red:

``` text
Asesinato de Julio César
    ├── Julio César
    ├── Senado Romano
    ├── Bruto
    ├── Casio
    ├── Roma
    ├── República Romana
    ├── guerras civiles
    ├── Octavio
    ├── Marco Antonio
    └── Segundo Triunvirato
```

Y además:

-   ¿Por qué ocurrió?
-   ¿Qué consecuencias tuvo?
-   ¿Qué cambió?
-   ¿Qué acontecimientos fueron contemporáneos?
-   ¿Qué conexiones de largo plazo generó?

------------------------------------------------------------------------

# 34. Regla de oro del proyecto

Cada vez que se incorpore información nueva, preguntar:

> **¿Qué otras partes de la historia modifica, explica o conecta esta
> información?**

ATLAS debe crecer en:

**PROFUNDIDAD + CONTEXTO + CONEXIONES + PRECISIÓN.**

No simplemente en cantidad de registros.

------------------------------------------------------------------------

# 35. Primera secuencia histórica

La primera gran secuencia de contenido debe desarrollarse
progresivamente:

``` text
Evolución humana
    ↓
Homininos
    ↓
Género Homo
    ↓
Homo sapiens
    ↓
Migraciones humanas
    ↓
Cazadores-recolectores
    ↓
Herramientas
    ↓
Fuego
    ↓
Lenguaje y cultura
    ↓
Arte
    ↓
Entierros
    ↓
Agricultura
    ↓
Sedentarización
    ↓
Aldeas
    ↓
Ciudades
    ↓
Especialización laboral
    ↓
Comercio
    ↓
Estados
    ↓
Escritura
    ↓
Civilizaciones
```

No asumir que esta secuencia fue completamente lineal.

Mostrar ramas independientes, desarrollos paralelos, desapariciones,
migraciones, mezclas culturales y múltiples centros de innovación.

------------------------------------------------------------------------

# 36. Primeras grandes civilizaciones

Después de construir la base prehistórica, avanzar progresivamente
hacia:

1.  Mesopotamia.
2.  Sumeria.
3.  Egipto.
4.  Civilización del Indo.
5.  China antigua.
6.  Persia.
7.  Grecia.
8.  Roma.
9.  Mundo medieval.
10. Mundo islámico.
11. África medieval y moderna.
12. Europa moderna.
13. Mesoamérica.
14. Andes.
15. Asia medieval y moderna.
16. Edad Moderna.
17. Revolución científica.
18. Revolución industrial.
19. Siglos XIX y XX.
20. Actualidad.

Estas etapas no deben ser capítulos aislados. Deben conectarse.

------------------------------------------------------------------------

# 37. Regla de conexiones entre civilizaciones

Cuando se incorpore una nueva civilización, investigar sistemáticamente
sus relaciones con las civilizaciones contemporáneas.

Por ejemplo, al incorporar Persia, investigar conexiones con:

-   Mesopotamia;
-   Anatolia;
-   Egipto;
-   Grecia;
-   Asia Central;
-   India.

Al incorporar Roma:

-   Grecia;
-   Egipto;
-   Persia;
-   Cartago;
-   pueblos germánicos;
-   Judea;
-   Arabia;
-   Mediterráneo.

Al incorporar el mundo islámico:

-   Arabia;
-   Persia;
-   Bizancio;
-   África;
-   India;
-   Europa.

No crear conexiones solo porque sean geográficamente cercanas. Cada
relación debe tener fundamento histórico.

------------------------------------------------------------------------

# 38. Arquitectura del producto

Antes de programar el contenido masivo, diseñar:

1.  Arquitectura general.
2.  Modelo de datos.
3.  Modelo de grafo.
4.  Modelo temporal.
5.  Sistema genealógico.
6.  Sistema GIS.
7.  Sistema de fuentes.
8.  Sistema de certeza histórica.
9.  Sistema causal.
10. Sistema de incorporación de contenido.
11. Sistema de búsqueda.
12. Sistema de navegación.
13. UX/UI.
14. Stack tecnológico.
15. Arquitectura de carpetas.
16. Estrategia de escalabilidad.

------------------------------------------------------------------------

# 39. MVP

El MVP debe incluir:

-   línea temporal;
-   nodos históricos;
-   relaciones;
-   grafo;
-   genealogías;
-   mapa;
-   fuentes;
-   niveles de certeza;
-   buscador;
-   fichas de eventos;
-   fichas de personajes;
-   fichas de civilizaciones;
-   modo "¿Qué pasaba en el mundo?";
-   zoom temporal;
-   arquitectura para incorporar contenido progresivamente.

El MVP no necesita contener toda la historia mundial.

Debe contener el **motor capaz de soportarla**.

------------------------------------------------------------------------

# 40. Filosofía de desarrollo

No intentar construir toda la historia de una sola vez.

Primero:

> **Construir el universo.**

Después:

> **Construir el esqueleto histórico.**

Después:

> **Alimentar progresivamente el sistema.**

Cada nuevo acontecimiento debe aumentar las conexiones del grafo.

El proyecto debe poder evolucionar durante años sin que la arquitectura
se vuelva obsoleta.

------------------------------------------------------------------------

# 41. Objetivo final

ATLAS debe permitir que un usuario pueda comenzar en cualquier punto:

-   Homo sapiens.
-   Sumeria.
-   Egipto.
-   Grecia.
-   Roma.
-   China.
-   India.
-   Persia.
-   Mesoamérica.
-   Alejandro Magno.
-   Cleopatra.
-   Julio César.
-   Confucio.
-   Buda.
-   Gengis Kan.
-   Mansa Musa.
-   Carlomagno.
-   Moctezuma.
-   Leonardo da Vinci.
-   Napoleón.
-   Einstein.
-   Segunda Guerra Mundial.
-   Revolución Industrial.
-   Internet.
-   actualidad.

Y desde cualquiera de ellos explorar conexiones hacia:

-   atrás;
-   adelante;
-   otras regiones;
-   otras civilizaciones;
-   otras personas;
-   otras ideas;
-   otras tecnologías;
-   otras causas;
-   otras consecuencias.

------------------------------------------------------------------------

# 42. Preguntas que ATLAS debe poder responder

La plataforma debe permitir investigar visualmente:

> ¿Cómo llegamos hasta aquí?

> ¿Qué ocurrió antes?

> ¿Qué estaba pasando al mismo tiempo en otra parte del mundo?

> ¿Por qué ocurrió este acontecimiento?

> ¿Qué factores lo provocaron?

> ¿Qué consecuencias tuvo?

> ¿Qué personas estuvieron conectadas?

> ¿Qué civilizaciones existían simultáneamente?

> ¿Qué tecnologías se transmitieron entre culturas?

> ¿Qué ideas sobrevivieron durante miles de años?

> ¿Qué acontecimientos cambiaron realmente el rumbo de la humanidad?

> ¿Qué acontecimientos antiguos todavía tienen consecuencias hoy?

------------------------------------------------------------------------

# 43. Visión final

ATLAS debe representar:

> **La historia de la humanidad como una enorme red interactiva de
> tiempo, personas, lugares, culturas, civilizaciones, ideas,
> tecnologías, conflictos, migraciones y acontecimientos.**

No una lista de fechas.

No una enciclopedia estática.

No un árbol genealógico aislado.

No una historia centrada en una sola civilización.

Debe ser un **atlas vivo del desarrollo humano**, capaz de crecer
progresivamente mediante nueva evidencia, nuevos acontecimientos, nuevas
relaciones y nuevas interpretaciones.

------------------------------------------------------------------------

# 44. Regla final

Cada vez que trabajemos en ATLAS, conservar estas prioridades en este
orden:

1.  **Precisión histórica.**
2.  **Contexto.**
3.  **Conexiones.**
4.  **Evidencia.**
5.  **Claridad.**
6.  **Profundidad.**
7.  **Experiencia de exploración.**
8.  **Espectacularidad visual.**

La espectacularidad nunca debe superar a la precisión.

La aplicación debe ser fascinante porque la historia real es fascinante.

# ATLAS

> **Explorar el pasado para comprender cómo llegamos hasta aquí.**
