//DEFINICIÓN VISUAL DE LOS BLOQUES 
        Blockly.defineBlocksWithJsonArray([
            //Bloques de Funciones Básicas
            {
                "type": "bloque_pintar",
                "message0": "pintar 🖌️",
                "previousStatement": null,
                "nextStatement": null,
                "colour": 130,
                "tooltip": "Pinta la casilla actual."
            },
            {
                "type": "bloque_subir",
                "message0": "subir ⬆️",
                "previousStatement": null,
                "nextStatement": null,
                "colour": 130,
                "tooltip": "Mueve el pincel hacia arriba."
            },
            {
                "type": "bloque_bajar",
                "message0": "bajar ⬇️",
                "previousStatement": null,
                "nextStatement": null,
                "colour": 130,
                "tooltip": "Mueve el pincel hacia abajo."
            },
            {
                "type": "bloque_derecha",
                "message0": "derecha ➡️",
                "previousStatement": null,
                "nextStatement" : null,
                "colour" : 130,
                "tooltip" : "Mueve el pincel hacia la derecha."
            },
            {
                "type": "bloque_izquierda",
                "message0": "izquierda ⬅️",
                "previousStatement": null,
                "nextStatement" : null,
                "colour" : 130,
                "tooltip" : "Mueve el pincel hacia la izquierda."
            },
            //Bloques de Color
            {
                "type": "bloque_seleccionarColor",
                "message0": "seleccionarColor 🎨 %1",
                args0: [
                    {
                        "type": "field_colour",
                        "name": "COLOR",
                        "colour": "#000000",
                        "columns": 8,
                        "colourOptions": [
                            "#000000", "#808080", "#c0c0c0", "#ffffff", "#d2b48c", "#a0522d", "#d2691e", "#a52a2a",
                            "#800000", "#ff0000", "#ff1493", "#ffc0cb", "#ff7f50", "#ffa500", "#ffd700", "#ffff00",
                            "#9acd32", "#00ff00", "#008000", "#228b22", "#808000", "#008080", "#00ffff", "#40e0d0",
                            "#87ceeb", "#4169e1", "#0000ff", "#000080", "#4b0082", "#800080", "#ff00ff", "#ee82ee"
                        ],
                        "colourTitles": [
                            "Negro", "Gris", "Plata", "Blanco", "Tostado", "Siena", "Chocolate", "Marrón",
                            "Granate", "Rojo", "Rosa Profundo", "Rosa", "Coral", "Naranja", "Oro", "Amarillo",
                            "Amarillo Verdoso", "Lima", "Verde", "Verde Bosque", "Oliva", "Verde Azulado", "Cian", "Turquesa",
                            "Azul Cielo", "Azul Real", "Azul", "Azul Marino", "Índigo", "Púrpura", "Magenta", "Violeta"
                        ]    
                    }
                ],
                "previousStatement": null,
                "nextStatement" : null,
                "colour" : 40,
                "tooltip" : "Selecciona el color del pincel."
            },
            {
                "type": "bloque_siguienteColor",
                "message0": "siguienteColor ⏭️",
                "previousStatement": null,
                "nextStatement" : null,
                "colour" : 40,
                "tooltip" : "Cambia el color al siguiente de la lista."
            },
            {
                "type": "bloque_colorRandom",
                "message0": "colorRandom 🎲",
                "previousStatement": null,
                "nextStatement" : null,
                "colour" : 40,
                "tooltip" : "Selecciona un color al azar"
            },
            {
                "type": "bloque_colores",
                "message0": "colores 🏳️‍🌈 %1",
                args0: [
                    {
                        "type": "field_colour",
                        "name": "COLOR",
                        "colour": "#000000",
                        "columns": 8,
                        "colourOptions": [
                            "#000000", "#808080", "#c0c0c0", "#ffffff", "#d2b48c", "#a0522d", "#d2691e", "#a52a2a",
                            "#800000", "#ff0000", "#ff1493", "#ffc0cb", "#ff7f50", "#ffa500", "#ffd700", "#ffff00",
                            "#9acd32", "#00ff00", "#008000", "#228b22", "#808000", "#008080", "#00ffff", "#40e0d0",
                            "#87ceeb", "#4169e1", "#0000ff", "#000080", "#4b0082", "#800080", "#ff00ff", "#ee82ee"
                        ],
                        "colourTitles": [
                            "Negro", "Gris", "Plata", "Blanco", "Tostado", "Siena", "Chocolate", "Marrón",
                            "Granate", "Rojo", "Rosa Profundo", "Rosa", "Coral", "Naranja", "Oro", "Amarillo",
                            "Amarillo Verdoso", "Lima", "Verde", "Verde Bosque", "Oliva", "Verde Azulado", "Cian", "Turquesa",
                            "Azul Cielo", "Azul Real", "Azul", "Azul Marino", "Índigo", "Púrpura", "Magenta", "Violeta"
                        ]    
                    }
                ],
                "output": null,
                "colour" : 40,
                "tooltip" : "Ver los colores disponibles"
            },
            //Bloques de Sensores
            {
                "type": "bloque_estaPintado",
                "message0": "estaPintado 🔍",
                "output": null,
                "colour" : 0,
                "tooltip" : "Verifica que el bloque esté pintado"
            },
            {
                "type": "bloque_colorCelda",
                "message0": "colorCelda 💧",
                "output": null,
                "colour" : 0,
                "tooltip" : "Retorna el color de la celda"
            },
            {
                "type": "bloque_colorActivo",
                "message0": "colorActivo 🪣",
                "output": null,
                "colour" : 0,
                "tooltip" : "Retorna el color que está utilizando el pincel"
            },
            {
                "type": "bloque_posicionX",
                "message0": "posicionX ↔️",
                "output": null,
                "colour" : 0,
                "tooltip" : "Retorna la posición X del pincel"
            },
            {
                "type": "bloque_posicionY",
                "message0": "posicionY ↕️",
                "output": null,
                "colour" : 0,
                "tooltip" : "Retorna la posición Y del pincel"
            }
        ]);
