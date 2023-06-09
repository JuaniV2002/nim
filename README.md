[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hFtQazP1)
Departamento de Computación  
FCEFQyN, Universidad Nacional de Río Cuarto  
Asignatura: Programación Avanzada  
Primer Cuatrimestre de 2023  

# Trabajo Práctico: Juego de las Piedras

# Este trabajo práctico debe ser resuelto en grupos de máximo tres personas. El proyecto podrá ser entregado cualquier fecha anterior al 15 de Junio a las 23.59hs a través de GitHub.

El trabajo práctico se trata de hacer un algoritmo para jugar el juego de las
piedras. Este juego es muy sencillo y consiste de dos jugadores (Humano vs
Computadora). El juego empieza con N piedras (con N>0) y cada jugador puede
tomar 1, 3 o 4 piedras en turnos. Cuando un jugador se queda sin piedras pierde, 
y por lo tanto gana el otro jugador. 

La idea es hacer un programa en Haskell para que la Computadora juegue de la mejor 
forma posible. En el juego empieza a jugar el humano, y luego la computadora, y se repite 
por turnos. Se puede notar que hay algunas configuraciones iniciales en que la
computadora no tiene jugadas ganadoras, es decir, el humano le va a ganar si
juega bien. De la misma forma, hay configuraciones en la cuales el humano no
tiene jugadas ganadoras.

El código en el repositorio tiene varias funciones implementadas y comentadas.
El trabajo práctico consiste en implementar las funciones que aparecen no
implementadas en el archivo TP.hs. 

El código provee una función:

  comenzarJuego :: Int -> IO()

  la cual dada una cantidad de piedras iniciales comienza un juego.
  
  Además de entregar la solución completa del juego, deberán adjuntar los casos de test realizados. 

