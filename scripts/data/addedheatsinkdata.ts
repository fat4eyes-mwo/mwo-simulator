
//Additional heatsink data to account for info not in smurfy
//Reference: http://steamcommunity.com/sharedfiles/filedetails/?id=686548357
namespace AddedData {
  export interface AddedHeatsinkData {
    internal_heat_capacity : number,
    external_heat_capacity : number,
  }

  export var _AddedHeatsinkData : {[index:string] : AddedHeatsinkData} = {
    "HeatSink_MkI" : {
      internal_heat_capacity : 1.1,
      external_heat_capacity : 1.2
    },
    "DoubleHeatSink_MkI" : {
      internal_heat_capacity : 2,
      external_heat_capacity : 1.5
    },
    "ClanDoubleHeatSink" : {
      internal_heat_capacity : 2,
      external_heat_capacity : 1.1
    }
  }
}
