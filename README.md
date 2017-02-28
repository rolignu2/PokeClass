# Pokeclass

  Version 1.0.1

``` Escrita su mayor parte en ES6, utilizando ``` : [pokeapi.co](https://pokeapi.co/docsv1/)

## Como se empieza 
  
  Descargate el repositorio y a continuacion en "src" esta la Pokeclass.min.js y una vez que guardes ese script 
  en donde desee tu corazon, mandalo a llamar de esta forma.

```
    <script scr="../Aguna-ruta/Pokeclass.min.js" type="text/javascript" ></script>
```

  Vamos bien.

## Comencemos a jugar 

## Usando la pokeclass para un solo pokemon o de uso simple 
### Javascript
```js

  //creamos una nueva instancia 
  var pokemon_ = new pokemon();

  // preparamos el pokemon por su numero asignado MEWTOW
  // tambien puedes colocar el nombre del pokemon por ejemplo pikachu :3
  pokemon_.preparePokemon(150); 
  
  // al momento de ejecutar la funcion preparePokemon comenzara a hacer una tarea asincrona
  // para controlar los resultados exite una funcion llamada 
  // execPokemon que sus parametros son los siguientes
  // execPokemon(funcion , tiempo_ejecucion  = 1000, puntero = null)


  /**
   * cuando la tarea asincrona termine se ejecutara la funcion creada 
   * y devolvera los datos que se han solicitado por ejemplo quiero que me devuelva
     la imagen del pokemon , su nombre y sus evoluciones
   */
  pokemon_.execPokemon(function(){
         
          let img     = pokemon_.sprite_image();
          let name    = pokemon_.pokeName();
          let evo     = pokemon_.evolutions();
                               
   });
  

```
  

