/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function () {

	this.onLoadStart = function () {};
	this.onLoadProgress = function () {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	constructor: THREE.Loader,

	crossOrigin: undefined,

	extractUrlBase: function ( url ) {

		var parts = url.split( '/' );

		if ( parts.length === 1 ) return './';

		parts.pop();

		return parts.join( '/' ) + '/';

	},

	initMaterials: function ( materials, texturePath, crossOrigin ) {

		var array = [];

		for ( var i = 0; i < materials.length; ++ i ) {

			array[ i ] = this.createMaterial( materials[ i ], texturePath, crossOrigin );

		}

		return array;

	},

	createMaterial: ( function () {

		var color, textureLoader, materialLoader;

		return function ( m, texturePath, crossOrigin ) {

			if ( color === undefined ) color = new THREE.Color();
			if ( textureLoader === undefined ) textureLoader = new THREE.TextureLoader();
			if ( materialLoader === undefined ) materialLoader = new THREE.MaterialLoader();

			// convert from old material format

			var textures = {};

			function loadTexture( path, repeat, offset, wrap, anisotropy ) {

				var fullPath = texturePath + path;
				var loader = THREE.Loader.Handlers.get( fullPath );

				var texture;

				if ( loader !== null ) {

					texture = loader.load( fullPath );

				} else {

					textureLoader.setCrossOrigin( crossOrigin );
					texture = textureLoader.load( fullPath );

				}

				if ( repeat !== undefined ) {

					texture.repeat.set( repeat[ 0 ], repeat[ 1 ] );

					if ( repeat[ 0 ] > 1 ) texture.wrapS = THREE.RepeatWrapping;
					if ( repeat[ 1 ] > 1 ) texture.wrapT = THREE.RepeatWrapping;

				}

				if ( offset !== undefined ) {

					texture.offset.set( offset[ 0 ], offset[ 1 ] );

				}

				if ( wrap !== undefined ) {

					if ( wrap[ 0 ] === 'repeat' ) texture.wrapS = THREE.RepeatWrapping;
					if ( wrap[ 0 ] === 'mirror' ) texture.wrapS = THREE.MirroredRepeatWrapping;

					if ( wrap[ 1 ] === 'repeat' ) texture.wrapT = THREE.RepeatWrapping;
					if ( wrap[ 1 ] === 'mirror' ) texture.wrapT = THREE.MirroredRepeatWrapping;

				}

				if ( anisotropy !== undefined ) {

					texture.anisotropy = anisotropy;

				}

				var uuid = THREE.Math.generateUUID();

				textures[ uuid ] = texture;

				return uuid;

			}

			//

			var json = {
				uuid: THREE.Math.generateUUID(),
				type: 'MeshLambertMaterial'
			};

			for ( var name in m ) {

				var value = m[ name ];

				switch ( name ) {
					case 'DbgColor':
						json.color = value;
						break;
					case 'DbgIndex':
					case 'opticalDensity':
					case 'illumination':
						// These were never supported
						break;
					case 'DbgName':
						json.name = value;
						break;
					case 'blending':
						json.blending = THREE[ value ];
						break;
					case 'colorDiffuse':
						json.color = color.fromArray( value ).getHex();
						break;
					case 'colorSpecular':
						json.specular = color.fromArray( value ).getHex();
						break;
					case 'colorEmissive':
						json.emissive = color.fromArray( value ).getHex();
						break;
					case 'specularCoef':
						json.shininess = value;
						break;
					case 'shading':
						if ( value.toLowerCase() === 'basic' ) json.type = 'MeshBasicMaterial';
						if ( value.toLowerCase() === 'phong' ) json.type = 'MeshPhongMaterial';
						break;
					case 'mapDiffuse':
						json.map = loadTexture( value, json.mapDiffuseRepeat, json.mapDiffuseOffset, json.mapDiffuseWrap, json.mapDiffuseAnisotropy );
						break;
					case 'mapDiffuseRepeat':
					case 'mapDiffuseOffset':
					case 'mapDiffuseWrap':
					case 'mapDiffuseAnisotropy':
						break;
					case 'mapLight':
						json.lightMap = loadTexture( value, json.mapLightRepeat, json.mapLightOffset, json.mapLightWrap, json.mapLightAnisotropy );
						break;
					case 'mapLightRepeat':
					case 'mapLightOffset':
					case 'mapLightWrap':
					case 'mapLightAnisotropy':
						break;
					case 'mapAO':
						json.aoMap = loadTexture( value, json.mapAORepeat, json.mapAOOffset, json.mapAOWrap, json.mapAOAnisotropy );
						break;
					case 'mapAORepeat':
					case 'mapAOOffset':
					case 'mapAOWrap':
					case 'mapAOAnisotropy':
						break;
					case 'mapBump':
						json.bumpMap = loadTexture( value, json.mapBumpRepeat, json.mapBumpOffset, json.mapBumpWrap, json.mapBumpAnisotropy );
						break;
					case 'mapBumpScale':
						json.bumpScale = value;
						break;
					case 'mapBumpRepeat':
					case 'mapBumpOffset':
					case 'mapBumpWrap':
					case 'mapBumpAnisotropy':
						break;
					case 'mapNormal':
						json.normalMap = loadTexture( value, json.mapNormalRepeat, json.mapNormalOffset, json.mapNormalWrap, json.mapNormalAnisotropy );
						break;
					case 'mapNormalFactor':
						json.normalScale = [ value, value ];
						break;
					case 'mapNormalRepeat':
					case 'mapNormalOffset':
					case 'mapNormalWrap':
					case 'mapNormalAnisotropy':
						break;
					case 'mapSpecular':
						json.specularMap = loadTexture( value, json.mapSpecularRepeat, json.mapSpecularOffset, json.mapSpecularWrap, json.mapSpecularAnisotropy );
						break;
					case 'mapSpecularRepeat':
					case 'mapSpecularOffset':
					case 'mapSpecularWrap':
					case 'mapSpecularAnisotropy':
						break;
					case 'mapAlpha':
						json.alphaMap = loadTexture( value, json.mapAlphaRepeat, json.mapAlphaOffset, json.mapAlphaWrap, json.mapAlphaAnisotropy );
						break;
					case 'mapAlphaRepeat':
					case 'mapAlphaOffset':
					case 'mapAlphaWrap':
					case 'mapAlphaAnisotropy':
						break;
					case 'flipSided':
						json.side = THREE.BackSide;
						break;
					case 'doubleSided':
						json.side = THREE.DoubleSide;
						break;
					case 'transparency':
						console.warn( 'THREE.Loader: transparency has been renamed to opacity' );
						json.opacity = value;
						break;
					case 'opacity':
					case 'transparent':
					case 'depthTest':
					case 'depthWrite':
					case 'transparent':
					case 'visible':
					case 'wireframe':
						json[ name ] = value;
						break;
					case 'vertexColors':
						if ( value === true ) json.vertexColors = THREE.VertexColors;
						if ( value === 'face' ) json.vertexColors = THREE.FaceColors;
						break;
					default:
						console.error( 'Loader.createMaterial: Unsupported', name, value );
						break;
				}

			}

			if ( json.type !== 'MeshPhongMaterial' ) delete json.specular;
			if ( json.opacity < 1 ) json.transparent = true;

			materialLoader.setTextures( textures );

			return materialLoader.parse( json );

		};

	} )()

};

THREE.Loader.Handlers = {

	handlers: [],

	add: function ( regex, loader ) {

		this.handlers.push( regex, loader );

	},

	get: function ( file ) {

		var handlers = this.handlers;

		for ( var i = 0, l = handlers.length; i < l; i += 2 ) {

			var regex = handlers[ i ];
			var loader  = handlers[ i + 1 ];

			if ( regex.test( file ) ) {

				return loader;

			}

		}

		return null;

	}

};
