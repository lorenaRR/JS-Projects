var palabra;
var alfabeto = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s", "t","u","v","w","x","y","z"];
var libreriaPalabras = new Array("m u l t i m e d i a", "i n t e r n a u t a", "s e r v i d o r", "p r o t o c o l o", "c o r t a f u e g o s",
"n a v e g a d o r", "n o d o", "m a r c o", "p a g i n a", "t e l a r a ñ a",
"d e s c a r g a r", "v i r t u a l", "m e m o r i a", "d i s c o", "l o c a l",
"c o n e c t a r", "d e s c o n e c t a r", "e n c a m i n a d o r", "i n t e r n e t", "d o m i n i o",
"d i n a m i c o", "h i p e r v i n c u l o", "e n l a c e", "m a r c a d o r", "o r d e n a d o r", "l a p i z", "o f i m a t i c a", "i n f o r m e" );

var tablero="";
var letrasPalabra;
var cont2=0; //Número de fallos
var final=""; //Palabra completa


function Empezar(){
    var i;
    //Habilita los botones
    for (i=0; i<alfabeto.length;i++){
       document.getElementById(alfabeto[i]).disabled = false;  
    }
    ObtienePalabra();  //Crea nueva palabra
    tablero=""; //Borra el tablero de la otra partida
    document.getElementById("usa").innerHTML=""; //Borra las letras usadas de la anterior partida
    cont2=0;
    document.getElementById("err").innerHTML=""; //Borra las letras usadas de la anterior partida
    CreaTablero(); //Crea rayitas
    letrasPalabra=tablero.split(" "); //Crea un array del tamaño de la palabra en la que cada elemento es "_"
    CambiaImagen(0); //Borra el ahorcado
	
}

function ObtienePalabra() {
  //Escoge aleatoriamente una palabra del array
   var indice = Math.round ( Math.random() * 27 );
   var cadena = new String( libreriaPalabras[indice] );
   palabra = cadena.split(" ");
   final = cadena.replace(/\s+/g, '');
}

function CreaTablero(){
    //Crea el "tablero" dónde muestra la palabra    
    var i;
    for (i=0;i<palabra.length;i++){
       tablero+="_ ";
    }    
        document.getElementById("pal").innerHTML=tablero;
}

function ComparaLetra(letra){
    
    var cont=0; //Para chequear los aciertos, si continua a 0 es que no hubo ninguno
    var palabraEntera="";
    var i;
    for (i=0;i<palabra.length;i++){ //Compara letra pulsada con todas las letras en array palabra
        if(palabra[i]==letra){ //Si encuentra una igual la sobre escribe en la posición del array letrasPalabras
            cont++;
            letrasPalabra[i]=palabra[i]; 
        }
    } 
    for (i=0;i<letrasPalabra.length;i++){
        palabraEntera+=letrasPalabra[i]+" "; //En palabraEntera creo un string con las letras descubiertas
    } 
    //palabraEntera=palabraEntera.toUpperCase;
    document.getElementById("pal").innerHTML=palabraEntera;
	document.getElementById("usa").innerHTML+=letra + ", ";
    
     if(cont==0){ //Si ha fallado, aumenta el contador de fallos y se dibuja el ahorcado
      cont2++;
      document.getElementById("err").innerHTML=cont2;		 
	 
     if (cont2<=6){
        CambiaImagen(cont2); 
     }
     else if(cont2>6){ //Si son más de 6 fallos, pierde y empieza de nuevo.
         alert("¡Has perdido!\nLa palabra era: "+ final); 
         Empezar();
     }
     }

     if ( final == palabraEntera.replace(/\s+/g, '') & cont<5){ //Si tiene menos de 6 fallos y ha completado la palabra,                                                     //gana y empieza de nuevo.
         alert("¡Has ganado!\nLa palabra era: "+ final);
         Empezar();
     }
             
}



function CambiaImagen(cont2){ //Dibuja el ahorcado
    document.getElementById("imagen").src="img/"+cont2+".jpg";
}

