//Définition des variables globales
var stage;
var layer;
var colors = ["blue", "red", "black", "yellow", "green"];
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

    //Création de l'élément racine
    var main = new Kinetic.Arc({
        angle:180,
        rotation:180,
        innerRadius:0,
        outerRadius:50,
        fill: '#234EFF',
        x: stage.getWidth() / 2,
        y: stage.getHeight()
    });

    main.on("mouseover", function(evt){
        this.opacity(0.7);
        document.body.style.cursor = 'pointer';
        layer.draw();
    });

    main.on("mouseout", function(evt){
        this.opacity(1);
        document.body.style.cursor = 'default';
        layer.draw();
    });

    //Au clic sur l'élément racine, on créé une nouvelle série de noeuds enfants
    main.on("click", addGroup);

    layer.add(main);

    layer.draw();
};

function addGroup()
{
    if (this.parent.nodeType != "Layer")
    {
        if (this.parent.parent.children.length - this.parent.index > 1)
        {
            for (i = this.parent.parent.children.length - 1; i > this.parent.index; i--)
            {
                //Ne fonctionne pas...
                /*var disappear = new Kinetic.Tween({
                    node: this.parent.parent.children[i],
                    opacity: 0,
                    duration: 1,
                    easing: Kinetic.Easings.Linear,
                    onFinish: this.parent.parent.children[i].destroy()
                })
                disappear.play();*/

                this.parent.parent.children[i].destroy();
            }
        }
    }

    //La rotation du groupe de noeuds ne s'applique pas à l'élément racine
    if (this.parent.nodeType != "Layer")
    {
        //On détermine la rotation à appliquer au groupe de noeuds
        startDeg = this.rotation();
        endDeg = this.rotation() + this.angle();
        middleDeg = (endDeg - Math.abs(startDeg)) / 2;
        toGo = -90 - middleDeg;
        
        var groupRotate = new Kinetic.Tween({
            node: this.parent,
            rotation: toGo,
            duration: 0.3,
            easing: Kinetic.Easings.Linear
        });

        groupRotate.play();
    }

    //Création du groupe de noeuds
    //Offset + position servent à permettre la rotation autour de l'élément racine
    var subGroup = new Kinetic.Group({
        offset: {x: stage.getWidth() / 2, y: stage.getHeight()},
        x: stage.getWidth() / 2, 
        y: stage.getHeight()
    });
    layer.add(subGroup);

    //Calcul de la position radiale des noeuds du groupe
    innerRadius = 50 + 30 * (subGroup.index - 1);

    //On détermine un nombre aléatoire de noeuds à créer pour ce groupe ainsi que leur taille
    var subSets = Math.round(Math.random()*4)+1;
    var subSetAngle = 180 / subSets;

    for(i = 1; i <= subSets; i++)
    {
        //Positionnement des noeuds par rotation autour de l'élément racine
        rotation = ((i-1) * subSetAngle) - 180;

        var subSet = new Kinetic.Arc({
            angle:0,
            rotation:   rotation,
            innerRadius:innerRadius,
            outerRadius:innerRadius+30,
            fill: getRandomColor(),
            x: stage.getWidth() / 2,
            y: stage.getHeight()
        });

        subSet.on("mouseover", function(evt){
            this.opacity(0.7);
            layer.draw();
            document.body.style.cursor = 'pointer';
        });

        subSet.on("mouseout", function(evt){
            this.opacity(1);
            layer.draw();
            document.body.style.cursor = 'default';
        });

        //Au clic sur un noeud, on créé un nouveau groupe de noeuds
        subSet.on("click", addGroup);

        //On ajoute le noeud au groupe
        subGroup.add(subSet);

        //Fonction anonyme qui permet d'enchainer les animations d'apparitions des noeuds
        var arcTween = (function(subGroup, subSet) {
            var _subGroup = subGroup;
            var _subSet = subSet;
            return {
                play: function(){
                    if ((subSet.index + 1) < _subGroup.children.length)
                    {
                        _subGroup.children[subSet.index + 1].tween.play();
                    }
                }
            }
        })(subGroup, subSet);

        //Animation d'apparition des noeuds
        var tween = new Kinetic.Tween({
            node: subSet,
            angle: subSetAngle,
            duration: 0.2 / subSets,
            easing: Kinetic.Easings.Linear,
            onFinish: arcTween.play
        });

        //On stocke l'objet d'animation d'apparition des noeuds pour pouvoir 
        //l'appeler en séquence, un noeud après l'autre (fonction arcTween)
        subSet.tween = tween;
        
    }

    //On déclenche l'animation d'apparition du premier noeud, les autres suiveront en séquence
    subGroup.children[0].tween.play();
}

function getRandomColor()
{
    var red = Math.round(Math.random()*255);
    var green = Math.round(Math.random()*255);
    var blue = Math.round(Math.random()*255);
    return "rgb(" + red + "," + green + "," + blue + ")";
}