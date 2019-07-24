import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name:"deckName"})
export class DeckNamePipe implements PipeTransform {
    transform(deckName:string, length?:number){
        let arrayName = deckName.split(" ")

        if(arrayName.length > 2){
            arrayName = arrayName.slice(0,2)
        }
        
        let combinedName = arrayName.join(" ")
        if(combinedName.length>length){
            return combinedName.slice(0,length) + "..."
        } else {
            return combinedName
        }
        
    }
}