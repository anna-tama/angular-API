const { Validators } = require('@angular/forms');
const { daysToWeeks } = require('date-fns');
const {Observable} = require('rxjs');
const {filter} = require('rxjs/operators');

const doSomething = () => {
  return new Promise((resolve)=>{
    // resolve('valor 1'); //solo resuelve un valor, no puede resolver dos cosas a la vez
    //ejecuta lo que tiene que ejecutar y devuelve el valor
    //no permite cancelar la promesa
    setTimeout(() => {
      resolve('valor 1')
    },3000 )
  })
}

const doSomething$ = () => {
  return new Observable(observer =>{
   observer.next('valor 1 $');
   observer.next('valor 2 $');
   observer.next('valor 3 $')
   observer.next(null);
   setTimeout(() => {
    observer.next('valor 4 $')
  },5000 )
  setTimeout(() => {
    observer.next(null)
  },8000 )
  setTimeout(() => {
    observer.next('valor 5 $')
  },10000 )
   //es un stram constante de datos devuelve más de un valor si se quiere
   //permite transmitir muchos datos sin estar creando promesas
   //permite cancelar el observador cuadno ya no me interesa

  })
}


(async () =>{
  const rta= await doSomething(); //se demora el tiempo que se tenga que demorar
  console.log(rta);
})();

(() => {
  const obs$ = doSomething$();
  obs$
  .pipe(
    filter(value => value !== null) //se suscribe a datos que no sean null
  )
  .subscribe(rta=> {
    console.log(rta);
  })
})()

// Promesas
// -Emite un solo valor
// -Simplicidad

// Observable
// -Stream de datos (puede emitir múltiples valores)
// -Es posible escuchar constantemente: EventSource, responsive, fechas
// -Se puede cancelar
