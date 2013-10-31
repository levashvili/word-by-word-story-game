/**
 * Created by leena on 10/22/13.
 */
var x = 10;

function f()
{
    console.log(this.x);
    console.log(this.y);
    console.log(this.z);
}

f();