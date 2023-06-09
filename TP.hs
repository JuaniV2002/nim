-- | Este es el codigo fuente del TP para la materia Progamación Avanza - 2023 - UNRC
-- El texto tiene varias funciones y tipos de datos ya implementados, el trabajo consiste en completar aquellas funciones 
-- que no se encuentran implementadas (es decir, estan definidas con 'undefined').  

module Piedras where 

-- | El siguiente tipo define los jugadores del juego, C por Computadora
--   y H por Humano
data Jugador = C | H deriving (Eq,Show)


-- | Definimos los estados, un estado es un jugador mas las cantidad de piedras disponibles
type Estado = (Jugador, Int) 

-- | Definimos los posibles estados del juegos, el resultado del juego, puede ser que la computadora pierda, o gane
data Resultado = CPerdio | CGano deriving (Eq,Ord,Show) 

-- | Definimos las posible jugadas, sacar 1 piedra, 3 piedras o 4 piedras
jugadas = [1,3,4]

-- | La funcion otro Jugador, dado un jugador, devuelve el otro jugador, por ejemplo: otroJugador C = H
otroJugador :: Jugador -> Jugador
otroJugador = undefined

-- | Dada una jugada (cantidad de piedras que se retiran) y un estado retorna el estado resultante, se deben controlar los casos de jugadas no posibles
hacerJugada :: Int -> Estado -> Estado
hacerJugada = undefined

-- |  evalEstado toma un estado como parametro, y dice si el estado es ganador o perdedor considerando
--  las mejores jugadas del oponente. Por ejemplo, evalEstado (H,2) = CGano, porque H solo puede
--  retirar 1 y luego la computadora retira 1 y gana
evalEstado :: Estado -> Resultado
evalEstado  (j, k)  | (k == 0) = if j == C then CPerdio else CGano
                  |  k>0 && j == C   = foldl max CPerdio $ map evalEstado posibleJugs
                  |  k>0 && j == H   = foldl min CGano $ map evalEstado posibleJugs   
                  |  otherwise = error "jugada no valida"
                  where posibleJugs = [(otroJugador j, k - i) | i<- jugadas, i<=k]    

-- | Calcula la mejor jugada para un estado dado, para el jugador dado.
-- Por ejemplo, mejorJug (H,3) debería devolver 3, ya que la mejor jugada para H cuando hay 3 piedras es retirar 3.
-- Ayuda: Tener en cuenta que el tipo Resultado implementa la clase Ord, es decir, tenemos
-- CPerdio < CGano. Es decir:
--
-- 	Para el caso mejorJug(C, k) tenemos que devolver la jugada que nos da el resultado maximo con respecto a C (es 
-- 	decir, la mejor jugada para la computadora).
-- 	
-- 	En el caso mejorJug (H, k) tenemos que devolver la jugada que nos da el valor minimo (es decir, consideramos 
-- 	la mejor jugada para H, que seria la peor para C).
mejorJug :: Estado -> Int
mejorJug = undefined

-- | Las siguientes funciones implementan una pequeña interface para poder jugar interactivamente,.
jugar :: Estado -> IO()
jugar (j,k) = do
	        putStrLn ("Hay "++ (show k) ++ " piedras, cuantas saca?:")	  
	        jugada <-  getLine
	        let s  = read jugada 
	            (j', k') = hacerJugada s (j,k) 
	        if k'==0 then (putStrLn "Gano!")
	        else do 
	     	     let mj = mejorJug (j',k')    
	     	     putStrLn ("mi jugada: "++(show mj))
	             if k' - mj ==0 
	             then putStrLn "Perdio!"
	             else do 
	             	  jugar (H, k' - mj) 
	      
-- | Comienza el juego con una cantidad de piedras dada el Humano  
comenzarJuego :: Int -> IO()
comenzarJuego cant | cant <= 0 = error "La cantidad de piedras debe ser mayor que 0."
                   | otherwise = jugar (H, cant)

-- juegosGanadores k, calcula todos los comienzos ganadores para la computadora hasta con k piedras
-- por ejemplo, juegosGanadores 10 = [2,7,9]
juegosGanadores :: Int -> [Int]
juegosGanadores i = undefined


