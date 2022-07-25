document.addEventListener("DOMContentLoaded",function(event){
    console.log("DOMContentLoaded");
    getPopularArtists();
    getTopsongs(246791);
})


const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '47e884c7f2msh0b51f7d588382d1p1de9dajsn5547acf5ba79',
		'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
	}
};

const Lib = {
    renderCollection: function (collection, template, target){
        let html='';
        let result = document.querySelector(target);
        
        for(let i=0; i<collection.length; i++){
          let rec = collection[i];
          html+= template(rec);
        }
  
        result.innerHTML = html;
    },

    renderItem : function (item, template, target){
      document.querySelector(target).innerHTML = template(item)
    },

    getData: async function (url){
      const response = await fetch(url, options);
      return response.json();
      
    }


};


function popularDisplayTemplate({picture, name,id}){
    return `
    <div class="artistCard" onclick="getTopsongs(${id})">
        <img src="${picture}" alt="image of + ${name}" />
    </div>`;
}

function songDisplayTemplate({title,duration,id}){
    let mintime = Math.trunc(duration/60);
    let sectime = duration%60;
    if(sectime<10){
        sectime = '0' + sectime;
    }
    return `
    <div class="songCard">
        <h2>${title} - ${mintime}:${sectime}</h2>
        <img src="./psign.svg" class="svgimg" onclick="addSong(${id})"></img>
    </div> `
    ;
}
function playlistDisplayTemplate({title,duration,id}){
    let mintime = Math.trunc(duration/60);
    let sectime = duration%60;
    if(sectime<10){
        sectime = '0' + sectime;
    }
    return `
    <div class="songCard">
        <h2>${title} - ${mintime}:${sectime}</h2>
        <img src="./tinybin.svg" class="svgimg" onclick="removeSong(${id})"></img>
    </div> `
    ;
}

const artistArray = ["246791","4050205","9635624","564","1424821","542","6982223","145"];
var artistList = [];
const url = "https://api.deezer.com/"


let test = {};
async function getPopularArtists(){

    for(let i = 0; i < artistArray.length;i++){
        await fetch('https://deezerdevs-deezer.p.rapidapi.com/artist/' + artistArray[i],options)
	    .then(response => {return response.json();
        }).then(data =>{
            artistList[i] = data;
        })
	    .catch(err => console.error(err));    
    }
    Lib.renderCollection(artistList, popularDisplayTemplate,"#featuredArtists");
    
}

let artistUrl = "https://deezerdevs-deezer.p.rapidapi.com/artist/";
async function getTopsongs(id){
    let topsonglist = await Lib.getData(artistUrl + id + "/top?limit=10",options);
    Lib.renderCollection(topsonglist.data, songDisplayTemplate,"#trackListing");
}


let songUrl = "https://deezerdevs-deezer.p.rapidapi.com/track/";
var Userplaylist=[];
async function addSong(id){
    let songDetails = await Lib.getData(songUrl + id,options);
    Userplaylist.push(songDetails);
    Lib.renderCollection(Userplaylist, playlistDisplayTemplate,"#Playlist");
}

function removeSong(rem_id){
    Userplaylist = Userplaylist.filter(y=>y.id!=rem_id);
    Lib.renderCollection(Userplaylist, playlistDisplayTemplate,"#Playlist");
}



async function searchArtist(){
    let name=document.getElementById("searchBar").value;
    name=name.toLowerCase();
    let searchedArtist = await Lib.getData("https://deezerdevs-deezer.p.rapidapi.com/search?q=" + name,options);
    Lib.renderCollection(searchedArtist.data, songDisplayTemplate,"#trackListing");
}