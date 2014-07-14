//Définition des variables globales
var stage;
var layer;
//Indique si une opération de drag/drop est en cours
var dragging = false;

window.onload = function(){

    //Création du stage
    stage = new Kinetic.Stage({
        container: "canvas",
        width: 800,
        height: 600
    });

    layer = new Kinetic.Layer();

    stage.add(layer);

    //L'événement "mouseup" déclenche la création d'une nouvelle bulle
    $(stage.getContainer()).mouseup(function(evt) {
        if (dragging == false) {
            addBubble(evt.pageX, evt.pageY)
        }
    });
};

function addBubble(x, y) {
    //Création du groupe qui contiendra la bulle et le texte
    var group = new Kinetic.Group({
        draggable:true
    });

    //Ajout du groupe au layer
    layer.add(group);

    //Les opérations dragstart et dragend sur le groupe influent sur la la variable global dragging
    //Cela permet de ne pas créer de conflit entre les événéments mouseup (création d'une nouvelle bulle
    //et dragend (fin du déplacement d'une bulle existante)
    group.on('dragstart', function(evt) {
        dragging = true;
    });

    group.on('dragend', function(evt) {
        dragging = false;
    });

    //Création de la bulle avec un radius à 0, à l'endroit où l'utilisateur a cliqué (x, y)
    var circle = new Kinetic.Circle({
        radius: 0,
        fill: 'red',
        x: x,
        y: y
    });

    var arc = new Kinetic.Arc({
        angle:0,
        rotation:270,
        innerRadius:50,
        outerRadius:60,
        fill: 'blue',
        x: x,
        y: y,
        dash: [10, 5, 20]
    });

    group.add(arc);

    //Ajout de la bulle au groupe
    group.add(circle);

    //Fonction anonyme qui permet d'ajouter un texte dans la bulle après son animation d'apparition    
    var label = (function(circle, layer, group, arc) {
        var _circle = circle;
        var _layer = layer;
        var _group = group;
        var _arc = arc;
        return {
            add: function(){
                var text = new Kinetic.Text({
                    x: _circle.getX() - (_circle.getWidth() / 2),
                    y: _circle.getY(),
                    text: new Date().getSeconds(),
                    fontSize: 40,
                    fontFamily: 'Calibri',
                    fill: 'yellow',
                    opacity:0,
                    width: _circle.getWidth(),
                    align:"center"
                });

                text.setY(_circle.getY() - (text.getHeight() / 2));
                text.setOpacity(1);

                _group.add(text);

                var tween = new Kinetic.Tween({
                    node: arc,
                    angle: 360,
                    duration: 0.2,
                    easing: Kinetic.Easings.Linear,
                });

                tween.play();
            }
        }
    })(circle, layer, group, arc);

    //Objet qui permet d'animer la propriété radius de la bulle de 0 à 50 en 0.5 secondes
    //À la fin de l'animation "label.add" est appelée pour ajouter le texte
    var tween = new Kinetic.Tween({
        node: circle,
        radius: 50,
        duration: 0.5,
        easing: Kinetic.Easings.BounceEaseOut,
        onFinish: label.add
    });

    //Démarrage de l'animation
    tween.play();
}

