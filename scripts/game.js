//TODO: Restructurize Enemy Movement - Big Update

//-----------CONFIG---------------
const MOVEOFFSET = 55;
const GAMEAREA_CORRECTION = 70;
const SHOOTOFFSETX = 15;
const SHOOTOFFSETY = 35;
const PROJECTILE_TRAVEL_TIME = 10;
const RHIT_OFFSET = 64; //Right HitBox
const LHIT_OFFSET = 30; //Left HitBox
const VHIT_OFFSET = 30; //Vertical HitBox
const SPAWN_OFFSET = 80;
const ENEMIES_IN_LINE = 5;
const NEW_ENEMY_LINE_OFFSET = 45;
const ENEMIES_START_POINT = -40;
const SPAWN_NEW_ENEMY_TIME = 2000; //ms
const TRY_RANDOMIZE_LIMIT = 800;
const MAX_ENEMIES_ID = 255;
const MAX_CASINGS_ID = 255;
//---------------------------------

/*---------------Variables---------------- */
var player_posx = window.getComputedStyle(document.getElementById("hero")).getPropertyValue("left");
var player_posy = window.getComputedStyle(document.getElementById("hero")).getPropertyValue("top");
var enemies_spawn_top = ENEMIES_START_POINT;
var casings = 0;
var enemies = 0;
var score = 0;
var hearts = 3;
/*-------------------------------------------- */


/*-----------------------MOVEMENT------------------------------- */
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
    if(get_player_posx_number()<=10){return;}

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

function playerLoseHeart()
{
    hearts-=1;
    if(hearts<=0)
    {
        return false;
    }
    document.getElementById("lifes_list").innerHTML = "";
    for(let i=0; i<hearts; i++)
    {
        document.getElementById("lifes_list").innerHTML += '<li><img src="images/hero.png"/></li>';
    }
    return true;
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
    casing.style.left = String(get_player_posx_number()+SHOOTOFFSETX)+"px";
    casing.style.top = String(get_player_posy_number()-SHOOTOFFSETY)+"px";

    projectile_fly(casing);
}

function set_casing_attr(casing){
    casing.setAttribute("id", "c"+String(casings));
    casing.setAttribute("class", "casing");
}

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

function projectile_destroy(proj){
    proj.remove();
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
            return true;
        }
    }
    return false;
}

function if_in_zone(posx, posy)
{
    let class_enemies = document.getElementsByClassName("enemy");

    //class_enemies.length-1 => removed '-1'
    for(let i=0; i<class_enemies.length; i++)
    {
        //Only checks in x pos, not whether it's correct in y pos
        if(
            (posx<=get_enemy_posx_number(class_enemies[i])+SPAWN_OFFSET && posx>=get_enemy_posx_number(class_enemies[i])-SPAWN_OFFSET) &&
            (posy==get_enemy_posy_number(class_enemies[i]))
        )
        {
            return true;
        }
    }
    return false;
}

/*-------------------ENEMIES--------------------------------------------------------*/


function spawnNewEnemies(){
    enemies_spawn_top+=NEW_ENEMY_LINE_OFFSET;
     renderEnemies();
}

function update_score(){
    if(score%(ENEMIES_IN_LINE*2)==0)
    {
        enemies_spawn_top = ENEMIES_START_POINT;
    }
    score+=1;
    document.getElementById("score").innerHTML = "Score: "+ String(score);
}

function renderEnemies()
{
    let new_line_enemy = 0;
    while(new_line_enemy<ENEMIES_IN_LINE){
        new_line_enemy+=1;
        enemies+=1;
        const enemy_div = document.createElement("div");
        set_enemy_div_attr(enemy_div)

        const enemy = document.createElement("img");
        enemy.src="images/enemy.png";
        
        enemy_div.appendChild(enemy);
        document.getElementById("gamearea").appendChild(enemy_div);

        //Setposition
        enemy_div.style.left = String(generate_enemy_position())+"px";
        enemy_div.style.top = String(enemies_spawn_top)+"px";
    }
}

function set_enemy_div_attr(enemy){
    enemy.setAttribute("id", "e"+String(enemies));
    enemy.setAttribute("class", "enemy");
}

function generate_enemy_position(){
    let randomized_pos = Math.floor(Math.random() * (window.innerWidth-GAMEAREA_CORRECTION-20)+1);
    let randomized_pos_try = 0;
    while(if_in_zone(randomized_pos, enemies_spawn_top))
    {
        if(randomized_pos_try>=TRY_RANDOMIZE_LIMIT)
        {
            enemies_spawn_top+=NEW_ENEMY_LINE_OFFSET;
            break;
        }
        randomized_pos_try+=1;
        randomized_pos = Math.floor(Math.random() * (window.innerWidth-GAMEAREA_CORRECTION-20)+1);
    }

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

/*------------------------------MAIN-------------------------------------------------*/
function LoseGame(){
    alert("Game Lost!");
    window.location.reload();
}

//Main Loop
async function startGame() 
{
    while(true)
    {
        if(enemies>=MAX_ENEMIES_ID)
        {
            enemies = 0;
        }
        if(casings>=MAX_CASINGS_ID)
        {
            casings = 0;
        }

        if(enemies_spawn_top>=get_player_posy_number()-NEW_ENEMY_LINE_OFFSET)
        {
            enemies_spawn_top = ENEMIES_START_POINT;
            if(!playerLoseHeart())
            {
                LoseGame();
            }
        }
        spawnNewEnemies();
        await sleep(SPAWN_NEW_ENEMY_TIME);
    }
        
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*-------------------------------------------------------------------------------------- */