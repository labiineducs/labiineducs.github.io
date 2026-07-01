// REGLAS DE TRADUCCIÓN A JAVASCRIPT

        //Bloques de Funciones Basicas
        javascript.javascriptGenerator.forBlock['bloque_pintar'] = function(block) {
            return 'pintar();\n';
        };
        javascript.javascriptGenerator.forBlock['bloque_subir'] = function(block) {
            return 'arriba();\n'; 
        };
        javascript.javascriptGenerator.forBlock['bloque_bajar'] = function(block) {
            return 'abajo();\n';  
        };
        javascript.javascriptGenerator.forBlock['bloque_derecha'] = function(block) {
            return 'derecha();\n';  
        };
        javascript.javascriptGenerator.forBlock['bloque_izquierda'] = function(block) {
            return 'izquierda();\n';  
        };


        //Bloques de Color
        javascript.javascriptGenerator.forBlock['bloque_seleccionarColor'] = function(block) {
            const hexElegido = block.getFieldValue('COLOR');
            // Diccionario para traducir de vuelta a los nombres en inglés 
            const hexANombre = {
                '#000000': 'black', '#808080': 'gray', '#c0c0c0': 'silver', '#ffffff': 'white',
                '#d2b48c': 'tan', '#a0522d': 'sienna', '#d2691e': 'chocolate', '#a52a2a': 'brown',
                '#800000': 'maroon', '#ff0000': 'red', '#ff1493': 'deeppink', '#ffc0cb': 'pink',
                '#ff7f50': 'coral', '#ffa500': 'orange', '#ffd700': 'gold', '#ffff00': 'yellow',
                '#9acd32': 'yellowgreen', '#00ff00': 'lime', '#008000': 'green', '#228b22': 'forestgreen',
                '#808000': 'olive', '#008080': 'teal', '#00ffff': 'cyan', '#40e0d0': 'turquoise',
                '#87ceeb': 'skyblue', '#4169e1': 'royalblue', '#0000ff': 'blue', '#000080': 'navy',
                '#4b0082': 'indigo', '#800080': 'purple', '#ff00ff': 'magenta', '#ee82ee': 'violet'
            }; 
            const colorNombre = hexANombre[hexElegido] || hexElegido;

            return 'seleccionarColor("' + colorNombre + '");\n';
        };
        javascript.javascriptGenerator.forBlock['bloque_siguienteColor'] = function(block){
            return 'siguienteColor();\n';
        }
        javascript.javascriptGenerator.forBlock['bloque_colorRandom'] = function(block){
            return 'colorRandom();\n';
        }
        javascript.javascriptGenerator.forBlock['bloque_colores'] = function(block) {
            const hexElegido = block.getFieldValue('COLOR');
            const hexANombre = {
                '#000000': 'black', '#808080': 'gray', '#c0c0c0': 'silver', '#ffffff': 'white',
                '#d2b48c': 'tan', '#a0522d': 'sienna', '#d2691e': 'chocolate', '#a52a2a': 'brown',
                '#800000': 'maroon', '#ff0000': 'red', '#ff1493': 'deeppink', '#ffc0cb': 'pink',
                '#ff7f50': 'coral', '#ffa500': 'orange', '#ffd700': 'gold', '#ffff00': 'yellow',
                '#9acd32': 'yellowgreen', '#00ff00': 'lime', '#008000': 'green', '#228b22': 'forestgreen',
                '#808000': 'olive', '#008080': 'teal', '#00ffff': 'cyan', '#40e0d0': 'turquoise',
                '#87ceeb': 'skyblue', '#4169e1': 'royalblue', '#0000ff': 'blue', '#000080': 'navy',
                '#4b0082': 'indigo', '#800080': 'purple', '#ff00ff': 'magenta', '#ee82ee': 'violet'
            };
            const colorNombre = hexANombre[hexElegido] || hexElegido; 
            return ['"' + colorNombre + '"', javascript.javascriptGenerator.ORDER_ATOMIC];
        };

        //Bloques de Sensor (Devuelven un valor, no usan salto de línea \n)
        javascript.javascriptGenerator.forBlock['bloque_estaPintado'] = function(block) {
            // ORDER_FUNCTION_CALL le dice a Blockly que esto es la ejecución de una función
            return ['estaPintado()', javascript.javascriptGenerator.ORDER_FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['bloque_colorCelda'] = function(block) {
            return ['colorCelda()', javascript.javascriptGenerator.ORDER_FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['bloque_colorActivo'] = function(block) {
            return ['colorActivo()', javascript.javascriptGenerator.ORDER_FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['bloque_posicionX'] = function(block) {
            return ['posicionX()', javascript.javascriptGenerator.ORDER_FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['bloque_posicionY'] = function(block) {
            return ['posicionY()', javascript.javascriptGenerator.ORDER_FUNCTION_CALL];
        };