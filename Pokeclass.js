

class pokeapi {
	
	
	constructor(){
		this.uri 		= "http://pokeapi.co/api/{version}/";
		this.v1 		= "v1";
		this.v2 		= "v2";
		this.origin		= "http://pokeapi.co/";
		this.error		= [];
	}
	
	get_v1(){
		return this.v1;
	}
	
	get_v2(){
		return this.v2;
	}
	
	get_poke_url(){
		return this.origin;
	}
	
	set_error (error)
	{
		this.error.push(error);
	}
	
	get_error (position = -1)
	{
		if(position == -1) 
			return this.error;
		else 
			return this.error[position];
	}

	get_ws (version , params , callback = null , error  = function(e){}  ){
		
		let url 		= this.uri.replace("{version}" , version );
		var $that 		= this;
		
		if(callback == null ){
			return url;
		}
		
		 var xhr = new XMLHttpRequest();
		 xhr.onreadystatechange = function()
		 {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					try{
						callback(JSON.parse(xhr.responseText));
					}catch(omg)
					{
						if(error)
							error(xhr);
					}
				} 
				else {
					if (error)
						error(xhr);
				}
			}
		};
		xhr.open("GET",  url + params , true);
		xhr.onerror = function() {$that.set_error(xhr.status); } ;
		xhr.send();
		
		return xhr;
	
	}
	

	execute(func, wait, times){
			var interv = function(w, t){
				return function(){
						if(typeof t === "undefined" || t-- > 0){
								setTimeout(interv, w);
						try{
								func.call(null);
						}
						catch(e){
							t = 0;
							throw e.toString();
					}
				}
        };
		}(wait, times);

		setTimeout(interv, wait);
	}
	
	
}



class pokemon  extends pokeapi{
	
	
	constructor(){
		
		//iniciamos el constructor de pokeapi 
		super();
		//obtenemos las urls de ambas versiones de pokeapi 
		this.url_v1 			= super.get_ws(super.get_v1());
		this.url_v2 			= super.get_ws(super.get_v2());
		
		//declaramos la pokemon_data por medio de esta variable obtendremos la informacion  
		this.pokemon_data		= {
			general 			: null,
			sprite				: null ,
			ability				: null ,
			move				: null ,
			description			: null , 
			type 				: null , 
			egg_groups			: null 
		};
		
		//inicializamos los estados de las llamadas para los callback�s
		this.x					= [
				{ name : 'pokestate' , 			status : false  	, call : false    },
				{ name : 'ability' , 			status : false  	, call : false    },
				{ name : 'pokemon_type' ,		status : false  	, call : false    },
				{ name : 'sprite' , 			status : false  	, call : false    },
				{ name : 'description' , 		status : false  	, call : false    },
				{ name : 'pokemon_move' ,		status : false  	, call : false    },
				{ name : 'egg_groups' ,			status : false  	, call : false    }
		];
		
		
	}

	
	get_versions(){
		return {
			"v1" : this.url_v1,
			"v2" : this.url_v2
		}
	}
	
	
	/******************************************************
	 *				FUNCIONES VARIAS  					*
	******************************************************/

	get_pokedata() {
		return this.pokemon_data;
	}
	
	
	
	get_wait( wait = true  , process = 'all' ){

	
		var BreakException = {};
		try{
			this.x.forEach((item)=>{
					
					if(process == 'all')
					{
						
						if( (item.status == false  || item.status === 1 ) && item.call == true )
						{
							wait = true ;
							BreakException.all = "finder"
							throw BreakException;
						}
						else {
							wait = false;
						}

					}
					else if(process == 'away') {
						
						if(item.status == false  || item.status == 'undefined' || item.status == null || item.status == 1)
							wait = true ;
						else 
							throw BreakException;
					}
					else if(item.name == process ) {
						
						if(item.status == false  || item.status == 'undefined' || item.status == null || item.status == 1)
							wait = true ;
						else 
							throw BreakException;
					}
					else{
						wait = true ;

					}
			});
			
		}catch(e){
			
			if(e.all == 'undefined')
				wait = false ;
			else 
				wait = true ;
		}
	
		
		/*if(wait)
			return this.get_wait(wait , process);
		else 
			return wait ;*/
		
		return wait;
		
	}
	

	
	get_await_status() {
		return this.x
	}
	
	
	
	
	/******************************************************
	 *				FUNCIONES ASINCRONAS 				*
	******************************************************/
	

	execMultiPokemons (pokemons = Array() , func )
	{
		var tick = 1000;
		if(typeof func == 'function')
		{
			
			for(var i = 0 ; i < pokemons.length ; i++ )
			{
				var p = new pokemon();
				p.preparePokemon(pokemons[i]);
				p.execPokemon(func , tick  , p);
			}
		}
		else if(typeof func == 'array' || typeof func == 'object')
		{
			for(var i = 0 ; i < pokemons.length ; i++ )
			{
				var p = new pokemon();
				p.preparePokemon(pokemons[i]);
				p.execPokemon(func[i] , tick , p);
			}
		}
		else 
			return false;
		
		return true;
		
	}
	
	
	execPokemon(func , tick = 1000 , that = null )
	{
		var $that = this;
		var idInterval = setInterval(function(){
		if($that.get_wait() == false ){
				clearInterval(idInterval);
				try{
					if(that !== null)
					{
						func(that);
					}
					else{
						func.call(null);
					}
					
					$that._default();
				}
				catch(e){
					throw e.toString($that.pokemon_threat);
				}
			}
		},tick );
		
		return idInterval;
		
	}
	
	
	preparePokemon(name ){
		
		var that = this;
		this.wait_callable("pokestate");
		that.callback('pokestate' , this.x.pokestate = super.get_ws(super.get_v1() , "pokemon/" + name , (data)=>{
			
			 this.pokemon_data.general = data;
			 this.get_ability(data.national_id);
			 this.get_type(data.national_id);
			 this.get_sprite(data.national_id);
			 this.get_description(data.national_id);
			 this.get_move(data.national_id);

			 that.callback("pokestate" , 4 );
		},(a)=> {
			this.pokemon_data.general = null ;
			this.wait_callable("pokestate" , false );
		}).readyState);
	}
	
	
	get_ability(id){
		var that = this;
		this.wait_callable("ability");
		that.callback("ability" , super.get_ws(super.get_v1() , "ability/" + id , (result)=>{
			this.pokemon_data.ability = result;
			that.callback("ability" , 4 );
		},(a)=> {
			this.pokemon_data.ability = null ;
			this.wait_callable("ability" , false );
		}).readyState);
	}
	
	
	get_type(id)
	{
		var that = this;
		this.wait_callable("pokemon_type");
		that.callback("pokemon_type" , super.get_ws(super.get_v1() , "type/" + id , (result)=>{
			this.pokemon_data.type = result;
			that.callback("pokemon_type" , 4 );
		},(a)=> {
			this.pokemon_data.type = null ;
			this.wait_callable("pokemon_type" , false );
		}).readyState);
	}
	
	
	get_sprite(id)
	{
		
		var that = this;
		id++;
		this.wait_callable("sprite");
		that.callback("sprite" , super.get_ws(super.get_v1() , "sprite/" + id  , (result)=>{
			this.pokemon_data.sprite = result;
			that.callback("sprite" , 4 );
		},(a)=> {
			this.pokemon_data.sprite = null ;
			this.wait_callable("sprite" , false );
		}).readyState);
	}
	
	
	get_description(id)
	{
		var that = this;
		this.wait_callable("description");
		that.callback("description" , super.get_ws(super.get_v1() , "description/" + id , (result)=>{
			this.pokemon_data.description = result;
			that.callback("description" , 4 );
		} ,(a)=> {
			this.pokemon_data.description = null ;
			this.wait_callable("description" , false );
		}).readyState);
	}
	
	
	get_pokedex (id_name)
	{
		var that = this;
		this.wait_callable("pokedex");
		that.callback("pokedex" , super.get_ws(super.get_v2() , "pokedex/" + id_name , (result)=>{
			this.pokemon_data.pokedex = result;
			that.callback("pokedex" , 4 );
		} , (a)=> {
			this.pokemon_data.pokedex = null ;
			this.wait_callable("pokedex" ,false );
		}).readyState);
	}
	
	
	get_move(id)
	{
		var that = this;
		this.wait_callable("pokemon_move");
		that.callback("pokemon_move" , super.get_ws(super.get_v1() , "move/" + id , (result)=>{
			this.pokemon_data.move = result;
			that.callback("pokemon_move" , 4 );
		} , (a)=> {
			this.pokemon_data.move = null ;
			this.wait_callable("pokemon_move" ,false );
		}).readyState);
	}
	
	
	
		
	get_egg_groups(group)
	{
		var that = this;
		this.wait_callable("egg_groups");
		that.callback("egg_groups" , super.get_ws(super.get_v1() , group , (result)=>{
			this.pokemon_data.move = result;
			that.callback("egg_groups" , 4 );
		} , (a)=> {
			this.pokemon_data.move = null ;
			this.wait_callable("egg_groups" ,false );
		}).readyState);
	}
	
	
	
	/******************************************************
	 *	FUNCIONES MANIPULACION DE DATOS VERSION PIKACHU	*
	 *					NIVEL : PIKACHU					*
	******************************************************/
	
	pokemon_id()
	{
		return this.findFormat("general" , "national_id");
	}
	
	
	sprite_image()
	{
		let a = this.findFormat("sprite" , "image");
		if(a === null ) return '';
		return  super.get_poke_url() +  a  ;
	}
	
	
	pokeName ()
	{
		return this.findFormat("general" , "name");
	}
	
	
	abilities ()
	{
		return this.findFormat("general" , "abilities");
	}
	
	
	defense()
	{
		return this.findFormat("general" , "defense");
	}
	
	
	attack()
	{
		return this.findFormat("general" , "attack");
	}
	
	
	speed()
	{
		return this.findFormat("general" , "speed");
	}
	
	species()
	{
		return this.findFormat("general" , "species");
	}
	
	attack_def()
	{
		return {
			attack 		: this.findFormat("general" , "sp_atk"),
			defense 	: this.findFormat("general" , "sp_def")
		}
	}
	
	exp()
	{
		return this.findFormat("general" , "exp");
	}
	
	pokedex_id ()
	{
		return this.findFormat("general" , "pkdx_id");
	}
	
	moves ()
	{
		return this.findFormat("general" , "moves");
	}
	
	gender_ratio()
	{
		return this.findFormat("general" , "male_female_ratio");
	}
	
	eggs_groups(  $allGroups = false )
	{
		
		let eggs = this.findFormat("general" , "egg_groups")[0];
		
		if(!$allGroups) 
			return eggs;
		
		var result_set = null;
		this.get_egg_groups(eggs.resource_uri);
		this.execPokemon(function(){
			result_set = this.pokemon_data.egg_groups;
		});
		
		return result_set;
	}
	
	descriptions_groups(  )
	{
		
		return this.findFormat("general" , "description");
	}
	
	evolutions()
	{
		return this.findFormat("general" , "evolutions");
	}
	
	
	
	/******************************************************
	 *		FUNCIONES PRIVADAS PARA LA POKECLASE		*
	 *					PIKA-PIKA						*
	******************************************************/
	
	callback (name , value )
	{
		for(let i = 0 ; i < this.x.length ; i++)
		{
			if(this.x[i].name === name )
			{
				this.x[i].status = value ;
			}
		}
	}
	
	
	findFormat (object , name )
	{
		let n = this.pokemon_data[object] ? this.pokemon_data[object][name] : null ;
		return n;
	}
	
	
	wait_callable (name  , status = true )
	{
		for(let i = 0 ; i < this.x.length ; i++)
		{
			if(this.x[i].name == name )
			{
					this.x[i].call = status  ;
			}
		}
	}
	
	_default()
	{
		for(let i = 0 ; i < this.x.length ; i++)
		{
			this.x[i].call 		= false ;
			this.x[i].status 	= false ;
		}
	}
	
	
	
}
