import Vue from 'vue';
import Vuex from 'vuex';
// import { stat } from 'fs';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    clearState: 'clear',
    hasGrid:false,
    toClear : true,
    toDelete : true,
    toRotate : true,
    isSelected:false,
    shapesColor: 'yellow',
    equipmentColor: 'yellow',
    playersColor: '',
    linesColor: 'black',
    color: {
      green: '#45d695',
      blue: '#3f95dc',
      yellow: '#ecc434',
      red: '#e54f3a',
      black: '#2f313c',
      grey: '#d5d5d5',
      white: '#ffffff'
    },
    tool: 'rectangle',
    downloading:false,
    playerText:false,
    text:'',
    isLine:false,
    isPlayer:false,
    imgLink:'',
    paperID:'',
    content:{},
    readySave:false,
    areaID:'',
    editorClear:false,
    paperSelect:false,
    pressValue:"",
    pressOuterShow:true,
    editPress:{},
    paperShow:"",
  },
  mutations: {
    setEditPress(state,newValue){
      state.editPress = newValue;
    },
    setPaperShow(state,newValue){
      state.paperShow = newValue;
    },
    changePressOuterShow(state){
      state.pressOuterShow = !state.pressOuterShow;
    },
    setpaperSelect(state,newValue){
      state.pressValue = newValue;
    },
    changepaperSelect(state){
      state.paperSelect = !state.paperSelect;
    },
    changeEditorClear(state){
      state.editorClear = !state.editorClear;
    },
    setAreaID(state,newAreaID){
      state.areaID = newAreaID;
    },
    setImgLink(state,newLink){
      state.imgLink = newLink;
    },
    changeClearState(state,newClearState){
      state.clearState = newClearState;
    },
    setShapesColor(state,newColor){
      state.shapesColor = newColor;
    },
    setEquipmentColor(state,newColor){
      state.equipmentColor = newColor;
    },
    setPlayersColor(state,newColor){
      state.playersColor = newColor;
    },
    setLinesColor(state,newColor){
      state.linesColor = newColor;
    },
    setTool(state,newTool){
      state.tool = newTool;
    },
    changeDownloading(state){
      state.downloading = ! state.downloading;
    },
    changeToClear(state){
      state.toClear = ! state.toClear;
    },
    changeToDelete(state){
      state.toDelete = ! state.toDelete;
    },
    changeToRotate(state){
      state.toRotate = ! state.toRotate;
    },
    changeGirdState(state){
      state.hasGrid = ! state.hasGrid;
    },
    changeSelectState(state,newState){
      state.isSelected = newState;
    },
    changePlayerTextState(state,newState){
      state.playerText = newState;
    },
    setText(state,newState){
      state.text = newState;
    },
    changeIsLineState(state,newState){
      state.isLine = newState;
    },
    changeIsPlayerState(state,newState){
      state.isPlayer = newState;
    },
    setPaperIDState(state,newState){
      state.paperID = newState;
    },
    setContent(state,newState){
      state.content = newState;
    },
    changeSaveState(state){
      state.readySave = !state.readySave;
    }
  },
  actions: {
    saveAction (context,content) {
      context.commit('setContent',content);
      context.commit('changeSaveState');
    },
    editPressAction (context,content) {
      context.commit('changePressOuterShow');
      context.commit('setEditPress',content);
    }
  }
});

export default store
