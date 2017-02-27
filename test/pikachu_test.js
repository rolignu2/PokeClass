
var pokemon_ = new pokemon();
var my_pokemons 		= [1,10,20,50,100,150,200,250 , 300 , 151 , 250 , 400 , 450 ,500 ,550 ];
var first 				= false;
var i 					= 0 ;

pokemon_.execMultiPokemons(my_pokemons , function(poke){
	
	 set_carousel({
		 sprite : poke.sprite_image(),
		 name   : poke.pokeName()
	 });
	
});


function set_carousel(data)
{
	let a = "";
	
	if(first == false )
	{
		first = true ;
		a = 'active'
	}
	
	let c 		= $(".carousel-inner");
	let k		= $(".carousel-indicators");
	
	let h 		= '<div style="height:300px !important;" class="item ' +  a  + '">';
		h 		+= '<div class="container">';
		h 		+= ' <div class="carousel-caption">';
		h		+= '<h1>' + data.name + '</h1>';
		h 		+= '<img class="img-circle" src="' + data.sprite  + '" alt="" width="140" height="140">';
		h   	+= ' </div> </div> </div>';
		
	
    k.append(' <li data-target="#myCarousel" data-slide-to="' + i + '" class="' + a + '"></li>');	
	c.append(h);
	
	
		
}

           
             