import Handlebars from 'handlebars/dist/handlebars'
import rp from 'request-promise'
import mainTemplate from './src/templates/main.html!text'
import cardStackTemplate from './src/templates/cardStack.html!text'
import cardTemplate from './src/templates/card.html!text'

//duplicate this spreadsheet and update altKey

const allTourneys = 20;

const urlStr = 'https://interactive.guim.co.uk/docsdata-test/1Fk3YkwTXnnKf1Ofodjpd1rpxvAie_i14YCPD0ciRI88.json';


const teamsArr = [{
    "Country": "Cameroon",
    "Color": "00AA00",
    "Order_appearance": 1
}, {
    "Country": "Bosnia Herzegovina",
    "Color": "11488E",
    "Order_appearance": 2
}, {
    "Country": "France",
    "Color": "1F295A",
    "Order_appearance": 3
}, {
    "Country": "Italy",
    "Color": "1F295A",
    "Order_appearance": 4
}, {
    "Country": "Japan",
    "Color": "254F8C",
    "Order_appearance": 5
}, {
    "Country": "Nigeria",
    "Color": "31C49F",
    "Order_appearance": 6
}, {
    "Country": "Mexico",
    "Color": "3A7566",
    "Order_appearance": 7
}, {
    "Country": "Algeria",
    "Color": "7ED321",
    "Order_appearance": 8
}, {
    "Country": "Uruguay",
    "Color": "87B8FA",
    "Order_appearance": 9
}, {
    "Country": "Russia",
    "Color": "A40E13",
    "Order_appearance": 10
}, {
    "Country": "Argentina",
    "Color": "A4C9D9",
    "Order_appearance": 11
}, {
    "Country": "Croatia",
    "Color": "AA0000",
    "Order_appearance": 12
}, {
    "Country": "Costa Rica",
    "Color": "BC021A",
    "Order_appearance": 13
}, {
    "Country": "Portugal",
    "Color": "CB0B3E",
    "Order_appearance": 14
}, {
    "Country": "Chile",
    "Color": "D0021B",
    "Order_appearance": 15
}, {
    "Country": "Spain",
    "Color": "D12D2E",
    "Order_appearance": 16
}, {
    "Country": "Australia",
    "Color": "F5A623",
    "Order_appearance": 17
}, {
    "Country": "Colombia",
    "Color": "F8E71C",
    "Order_appearance": 18
}, {
    "Country": "Switzerland",
    "Color": "FD293F",
    "Order_appearance": 19
}, {
    "Country": "Belgium",
    "Color": "FF0000",
    "Order_appearance": 20
}, {
    "Country": "South Korea",
    "Color": "FF0000",
    "Order_appearance": 21
}, {
    "Country": "Netherlands",
    "Color": "FF3300",
    "Order_appearance": 22
}, {
    "Country": "Ivory Coast",
    "Color": "FF6600",
    "Order_appearance": 23
}, {
    "Country": "Ecuador",
    "Color": "FFAA00",
    "Order_appearance": 24
}, {
    "Country": "Brazil",
    "Color": "FFCC00",
    "Order_appearance": 25
}, {
    "Country": "England",
    "Color": "FEFEFE",
    "Order_appearance": 26
}, {
    "Country": "Germany",
    "Color": "FEFEFE",
    "Order_appearance": 27
}, {
    "Country": "Ghana",
    "Color": "FEFEFE",
    "Order_appearance": 28
}, {
    "Country": "Greece",
    "Color": "FEFEFE",
    "Order_appearance": 29
}, {
    "Country": "Honduras",
    "Color": "FEFEFE",
    "Order_appearance": 30
}, {
    "Country": "Iran",
    "Color": "FEFEFE",
    "Order_appearance": 31
}, {
    "Country": "USA",
    "Color": "FEFEFE",
    "Order_appearance": 32
}]


export async function render() {
    return rp({
        uri: urlStr,
        json: true
    }).then((data) => {

        let d = formatData(data);

        let html = compileHTML(d);

        return html;
    });


}

function formatData(data) {
    var newObj = {};
    let count = 0;

    data.sheets.Sheet1.map((obj, k) => {
        obj.ref = k;
    })

    let groups = groupBy(data.sheets.Sheet1, 'Team');

    groups = sortByKeys(groups);

    groups.map((obj, k) => {
        obj.groupRef = k;
        obj.groupKO = 0;
        obj.r16KO = 0;
        obj.qfKO = 0;
        obj.sfKO = 0;
        obj.ruKO = 0;
        obj.winnerKO = 0;
        obj.lastImg = "";
        obj.bgColorRef = "#EFEFEF";
        obj.objArr.map((ob, numKey) => {
            if (ob.Progress == 'Group stage') { obj.groupKO++ }
            if (ob.Progress == 'Round 1') { obj.groupKO++ }
            if (ob.Progress == 'Round of 16') { obj.r16KO = obj.r16KO + 1 }
            if (ob.Progress == 'Quarter-final' || ob.Progress == 'Round 2') { obj.qfKO = obj.qfKO + 1 }
            if (ob.Progress == 'Semi-final' || ob.Progress == 'Third Place' || ob.Progress == 'Fourth Place') { obj.sfKO = obj.sfKO + 1 }
            if (ob.Progress == 'Runners-up') { obj.ruKO = obj.ruKO + 1 }
            if (ob.Progress == 'Winners') { obj.winnerKO = obj.winnerKO + 1; console.log(obj) }
            ob.groupRef = obj.groupRef;
            ob.teamRef = ob.Team.toLowerCase();
            ob.teamRef = ob.teamRef.split(" ").join("-");
            ob.spriteClass = ob.teamRef + "-" + ob.Year + "-1";
            if (ob['Shirt-Thumb']) { ob.thumbImg = ob.teamRef + "_" + ob.Year + "_1.png" };

            obj.lastImg = ob.thumbImg = ob.teamRef + "_" + ob.Year + "_1.png";

            if (ob.captionTitle){ obj.captionTitle = ob.captionTitle; }

            if (ob.captionCopy){ obj.captionCopy = ob.captionCopy; }

            if (ob.captionLink){ obj.captionLink = ob.captionLink;}

            if (ob.Won === "Y"){ ob.trophyWon = true;}

            
        })

        obj.objArr.reverse();

        obj.group_pc = (obj.groupKO / allTourneys) * 100;
        obj.r16_pc = (obj.r16KO / allTourneys) * 100;
        obj.qf_pc = (obj.qfKO / allTourneys) * 100;
        obj.sf_pc = (obj.sfKO / allTourneys) * 100;
        obj.ru_pc = (obj.ruKO / allTourneys) * 100;
        obj.winner_pc = (obj.winnerKO / allTourneys) * 100;

        obj.finalsAppearances = obj.objArr.length;

        obj.totalTournaments_pc = (obj.finalsAppearances / allTourneys) * 100;

        obj = getTeamColor(obj);



        getCaption(obj);




        // headGroup.map((headOb) => {
        //     if(headOb['card-group'] == obj.sortOn )  {
        //         obj.Header = headOb.Header;
        //         obj.Standfirst = headOb.Standfirst;
        //     }
        // })


    });

    newObj.navGroup = teamsArr;

    newObj.groups = groups;




    return newObj;
}


function getTeamColor(ob){

    teamsArr.map((team, numKey) => {
         team.borderClass = "border-off";
            if (ob.sortOn == team.Country) { 
                ob.Color = "#"+team.Color;
                ob.Order_appearance = "#"+team.Order_appearance;
                ob.borderClass = "border-off";
            }

            if(team.Color==="FEFEFE"){
                team.borderClass = "border-on";
            }

           
        })



}

function getCaption(ob){
    


    // var o = ob.objArr[0];

    // if (o.captionTitle){
  
    //     ob.captionTitle = o.captionTitle;
    // }

    // if (o.captionCopy){
    
    //     ob.captionCopy = o.captionCopy;
    // }

    // if (o.captionLink){
    
    //     ob.captionLink = o.captionLink;
    // }

    // return ob;

}



function compileHTML(dataIn) {
    Handlebars.registerHelper('html_decoder', function(text) {
        var str = unescape(text).replace(/&amp;/g, '&');
        return str;
    });

    Handlebars.registerPartial({
        'cardstack': cardStackTemplate,
        'card': cardTemplate
    });

    var content = Handlebars.compile(
        mainTemplate, {
            compat: true
        }
    );

    var newHTML = content(dataIn);

    return newHTML

}


function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

// function sortByKey(myObj) {
//     let keys = Object.keys(myObj),i, len = keys.length;

//     keys.sort();

//     for (i = 0; i < len; i++) {
//       let k = keys[i];
//  
//     }

// }

function sortByKeys(obj) {
    let keys = Object.keys(obj),
        i, len = keys.length;

    keys.sort();

    var a = []

    for (i = 0; i < len; i++) {
        let k = keys[i];
        let t = {}
        t.sortOn = k;
        t.objArr = obj[k]
        a.push(t);
    }

    return a;
}


function compareArr(a, b, v) {
  const genreA = a[v].toUpperCase();
  const genreB = b[v].toUpperCase();
  
  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}

