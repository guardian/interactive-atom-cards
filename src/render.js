import Handlebars from 'handlebars/dist/handlebars'
import rp from 'request-promise'
import mainTemplate from './src/templates/main.html!text'
import cardStackTemplate from './src/templates/cardStack.html!text'
import cardTemplate from './src/templates/card.html!text'

const allTourneys = 20;

export async function render() {
    return rp({
        uri: 'https://interactive.guim.co.uk/docsdata-test/1Fk3YkwTXnnKf1Ofodjpd1rpxvAie_i14YCPD0ciRI88.json',
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

    let related = data.sheets.relatedContent[0];

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
            if (ob.Progress == 'Winners') { obj.winnerKO = obj.winnerKO + 1; }
            ob.groupRef = obj.groupRef;
            ob.teamRef = ob.Team.toLowerCase();
            ob.teamRef = ob.teamRef.split(" ").join("-");
            ob.spriteClass = ob.teamRef + "-" + ob.Year + "-1";
            if (ob['Shirt-Thumb']) { ob.thumbImg = ob.teamRef + "_" + ob.Year + "_1.png" };

            obj.lastImg = ob.thumbImg = ob.teamRef + "_" + ob.Year + "_1.png";

            if (ob.captionTitle){ obj.captionTitle = ob.captionTitle; obj.objArr[obj.objArr.length - 1].yellowBorder = true;  }

            if (ob.captionCopy){ obj.captionCopy = ob.captionCopy; }

            if (ob.captionLink){ obj.captionLink = ob.captionLink;}

            if (ob.Won === "Y"){ ob.trophyWon = true;}

            obj.teamRef = ob.teamRef;

            obj.teamFormatted = ob.Team;
            
        })

        obj.objArr.reverse();



        var prevCap = false;

        //KEEP FOR TOURNEY PERFORMANCE DATA
        // obj.group_pc = (obj.groupKO / allTourneys) * 100;
        // obj.r16_pc = (obj.r16KO / allTourneys) * 100;
        // obj.qf_pc = (obj.qfKO / allTourneys) * 100;
        // obj.sf_pc = (obj.sfKO / allTourneys) * 100;
        // obj.ru_pc = (obj.ruKO / allTourneys) * 100;
        // obj.winner_pc = (obj.winnerKO / allTourneys) * 100;

        obj.finalsAppearances = obj.objArr.length;

        if(obj.finalsAppearances > 1 && obj.captionTitle || obj.finalsAppearances > 2 ){ obj.showMobileExpandButton = true }

        if(obj.finalsAppearances < 2 && obj.captionTitle || obj.finalsAppearances < 3 ){ obj.hideMobileExpandButton = true }   

        // obj.totalTournaments_pc = (obj.finalsAppearances / allTourneys) * 100;


    });

    groups.forEach(function(s, i){


        if(i % 2 == 0){

            s.ad = i;
        }
    })

    newObj.related = related;

    newObj.groups = groups;


    return newObj;
}







function compileHTML(dataIn) {

    console.log(dataIn.related.related1Image)

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

