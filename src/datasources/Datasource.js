export default class Datasource{
    constructor () {
        this.filters = [];
    }
    
    start(){
        console.log('Starting datasource');
    }
    
    stop(){
        console.log('Stopping datasource');
    }
    
    filter (filter){
        return this;
    }
}