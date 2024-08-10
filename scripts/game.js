//TODO: While Pressing "Fire" multiple times, projectiles are being destroyed before reaching end point

var player_posx = window.getComputedStyle(document.getElementById("hero")).getPropertyValue("left");
var player_posy = window.getComputedStyle(document.getElementById("hero")).getPropertyValue("top");

//-----------CONFIG---------------
const MOVEOFFSET = 35;
const GAMEAREA_CORRECTION = 70;
const SHOOTOFFSETX = 15;
const SHOOTOFFSETY = 35;
const PROJECTILE_TRAVEL_TIME = 10;
const RHIT_OFFSET = 64; //Right HitBox
const LHIT_OFFSET = 30; //Left HitBox
const VHIT_OFFSET = 30; //Vertical HitBox
const SPAWN_OFFSET = 80;
const ENEMY_LINE = 10;
const NEW_ENEMY_LINE_OFFSET = 20;
//---------------------------------

var enemies_spawn_top = 0;
var casings = 0;
var enemies = 0;
var score = 0;

//controls
document.addEventListener("keypress", function(event) {
    //left, right, fire
    if (event.key == 'a') 
    {
        move_left();
    }
    if(event.key == 'd')
    {
       move_right();
    }
    if(event.key == " ")
    {
        player_fire();
    }

  });

function move_left(){
    if(get_player_posx_number()<=0){return;}

        player_posx = window.getComputedStyle(document.getElementById("hero")).getPropertyValue("left");
        player_posx = String(get_player_posx_number()-MOVEOFFSET)+"px";
        document.getElementById("hero").style.left = player_posx;
}

function move_right(){
    if(get_player_posx_number()>=window.innerWidth-GAMEAREA_CORRECTION){return;}

        player_posx = window.getComputedStyle(document.getElementById("hero")).getPropertyValue("left");
        player_posx = String(get_player_posx_number()+MOVEOFFSET)+"px";
        document.getElementById("hero").style.left = player_posx;
}

function get_player_posx_number()
{
    return Number(player_posx.substring(0, player_posx.indexOf('p')));
}
function get_player_posy_number()
{
    return Number(player_posy.substring(0, player_posy.indexOf('p')));
}


/*----------------FIRING CONTROLS----------------------------*/
function player_fire(){
    casings+=1;
    const casing = document.createElement("div");
    set_casing_attr(casing);

    const bullet = document.createElement("img");
    bullet.src="images/bullet.png";
    
    casing.appendChild(bullet);
    document.getElementById("gamearea").appendChild(casing);

    //Setposition
    document.getElementById("c"+String(casings)).style.left = String(get_player_posx_number()+SHOOTOFFSETX)+"px";
    document.getElementById("c"+String(casings)).style.top = String(get_player_posy_number()-SHOOTOFFSETY)+"px";

    projectile_fly(casing);
}

/**
 * @param {HTMLDivElement} casing
 */
function set_casing_attr(casing){
    casing.setAttribute("id", "c"+String(casings));
    casing.setAttribute("class", "casing");
}

/**
 * @param {HTMLDivElement} casing
 */
function projectile_fly(proj){
    //Hit
    if(if_hit_destroy_enem(proj))
    {
        projectile_destroy(proj);
        update_score();
        return;
    }
    
    //Missed
    if(get_projectile_posy_number(proj) <= 0){
        projectile_destroy(proj);
        return;
    }

    proj.style.top = String(gravity(proj))+"px";
    setTimeout(projectile_fly, PROJECTILE_TRAVEL_TIME, proj);
}

function get_projectile_posx_number(proj){
    return Number(window.getComputedStyle(proj).getPropertyValue("left").substring(0, window.getComputedStyle(proj).getPropertyValue("left").indexOf('p')));
}
function get_projectile_posy_number(proj){
    return Number(window.getComputedStyle(proj).getPropertyValue("top").substring(0, window.getComputedStyle(proj).getPropertyValue("top").indexOf('p')));
}

/**
 * @param {HTMLDivElement} proj
 */
function projectile_destroy(proj){
    proj.remove();
    casings-=1;
}

function gravity(proj){
    return get_projectile_posy_number(proj)-PROJECTILE_TRAVEL_TIME;
}

function if_hit_destroy_enem(proj)
{
    let class_enemies = document.getElementsByClassName("enemy");
    for(let i=0; i<class_enemies.length; i++)
    {
        if((get_projectile_posy_number(proj) <= get_enemy_posy_number(class_enemies[i])+VHIT_OFFSET) && 
            (get_projectile_posx_number(proj)<=get_enemy_posx_number(class_enemies[i])+RHIT_OFFSET && get_projectile_posx_number(proj)>=get_enemy_posx_number(class_enemies[i])-LHIT_OFFSET))
        {
            enemy_destroy(class_enemies[i]);
            enemies-=1;
            return true;
        }
    }
    return false;
}

function if_in_zone(pos)
{
    let class_enemies = document.getElementsByClassName("enemy");
    for(let i=0; i<class_enemies.length-1; i++)
    {
        if(pos<=get_enemy_posx_number(class_enemies[i])+SPAWN_OFFSET && pos>=get_enemy_posx_number(class_enemies[i])-SPAWN_OFFSET)
        {
            //console.log("IN ZONE");
            //console.log("[IZ] Randomized Pos: "+String(pos));
            //console.log("[IZ] Enemy Pos: "+String(get_enemy_posx_number(class_enemies[i])));
            return true;
        }
        //console.log("Randomized Pos: "+String(pos));
        //console.log("Enemy Pos: "+String(get_enemy_posx_number(class_enemies[i])));
    }
    return false;
}

/*-------------------ENEMIES--------------------------------------------------------*/


function startgame(){
    enemies_spawn_top+=NEW_ENEMY_LINE_OFFSET;
     spawnEnemies();
}

function update_score(){
    score+=1;
    document.getElementById("score").innerHTML = "Score: "+ String(score);
}

function spawnEnemies()
{
    let new_line_enemy = 0;
    while(new_line_enemy<ENEMY_LINE){
        new_line_enemy+=1;
        enemies+=1;
        const enemy_div = document.createElement("div");
        set_enemy_div_attr(enemy_div)

        const enemy = document.createElement("img");
        enemy.src="images/enemy.png";
        
        enemy_div.appendChild(enemy);
        document.getElementById("gamearea").appendChild(enemy_div);

        //Setposition
        document.getElementById("e"+String(enemies)).style.left = String(generate_enemy_position())+"px";
        document.getElementById("e"+String(enemies)).style.top = String(enemies_spawn_top)+"px";
    }
}

function set_enemy_div_attr(enemy){
    enemy.setAttribute("id", "e"+String(enemies));
    enemy.setAttribute("class", "enemy");
}

function generate_enemy_position(){
    let randomized_pos = Math.floor(Math.random() * (window.innerWidth-GAMEAREA_CORRECTION-20)+1);
    while(if_in_zone(randomized_pos))
    {
        randomized_pos = Math.floor(Math.random() * (window.innerWidth-GAMEAREA_CORRECTION-20)+1);
    }
    //console.log("FINAL: "+String(randomized_pos));

    return randomized_pos;
}

function get_enemy_posx_number(enemy)
{
    return Number(window.getComputedStyle(enemy).getPropertyValue("left").substring(0, window.getComputedStyle(enemy).getPropertyValue("left").indexOf('p')));
}
function get_enemy_posy_number(enemy)
{
    return Number(window.getComputedStyle(enemy).getPropertyValue("top").substring(0, window.getComputedStyle(enemy).getPropertyValue("top").indexOf('p')));
}

function enemy_destroy(enemy)
{
    enemy.remove();
}

/*----------------------------------------------------------------------------------*/