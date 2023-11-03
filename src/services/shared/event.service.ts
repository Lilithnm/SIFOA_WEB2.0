import { BehaviorSubject } from "rxjs";


export class EventService{

    private childClickedEvent = new BehaviorSubject<string>('');
   
     emitChildEvent(msg: string){
        this.childClickedEvent.next(msg)
     }
   
     childEventListner(){
        return this.childClickedEvent.asObservable();
      } 
   
   }