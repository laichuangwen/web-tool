const Store = require('electron-store');
const schema = {
    depotList:{
        type: 'array'
    },
    swaggerList: {
        type: 'array'
    },
    yapiList: {
        type: 'array'
    },
    docUrl: {
        type: 'string'
    },

};
const store = new Store({schema});
export default ({ Vue }) => {
    Vue.$ctx.eStore = store

}