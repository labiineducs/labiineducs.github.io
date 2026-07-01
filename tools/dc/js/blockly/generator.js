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
            const colorElegido = block.getFieldValue('COLOR');
            return 'seleccionarColor("' + colorElegido + '");\n';
        };
        javascript.javascriptGenerator.forBlock['bloque_siguienteColor'] = function(block){
            return 'siguienteColor();\n';
        }
        javascript.javascriptGenerator.forBlock['bloque_colorRandom'] = function(block){
            return 'colorRandom();\n';
        }

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