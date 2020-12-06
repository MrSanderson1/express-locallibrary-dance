$(document).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dansTypeInt = urlParams.get('t');
    setDansType(dansTypeInt);
    setLesTypes(dansTypeInt);
 });


function annuleerFormulier()
{
    document.getElementById("inputNaam").value = "";
    document.getElementById("inputANaam").value = "";
    document.getElementById("inputL").value = "";
    document.getElementById("geslachtV").checked = false;
    document.getElementById("geslachtM").checked = false;
    document.getElementById("geslachtA").checked = false;
    document.getElementById("inputMail").value = "";
    setDansType("0");
    setLesTypes("0");
    document.getElementById("aantalPersonenInLes").innerText = "";
}

function verzendFormulier()
{
    var nm = document.getElementById("inputNaam").value;
    var anm = document.getElementById("inputANaam").value;
    var leeft = document.getElementById("inputL").value;
    var geslV = document.getElementById("geslachtV").checked;
    var geslM = document.getElementById("geslachtM").checked;
    var geslA = document.getElementById("geslachtA").checked;
    
    
    if( !(nm && nm.trim().length > 0))
    {
        alert("Error: gelieve uw naam in te vullen. Dit is een verplicht veld.");
        return;
    }
    
    if( !(anm && anm.trim().length > 0))
    {
        alert("Error: gelieve uw achternaam in te vullen. Dit is een verplicht veld.");
        return;
    }
    
    if( !(leeft && leeft > 0))
    {
        alert("Error: gelieve uw leeftijd in te vullen. Dit is een verplicht veld.");
        return;
    }
    
    var geslacht = "";
    if( geslV === false && geslM === false && geslA === false)
    {
        alert("Error: gelieve uw geslacht aan te duiden. Dit is een verplicht veld.");
        return;
    }
    else
    {
        if(geslV === true)
        {
            geslacht = "VROUW";
        }
        else if(geslM === true)
        {
            geslacht = "MAN";
        }
        else
        {
            geslacht = "ANDER";
        }
    }
    
    var mail =  document.getElementById("inputMail").value;
    if(!(mail && mail.trim().length > 0))
    {
        alert("Error gelieve uw email in te vullen. Dit is een verplicht veld.");
        return;
    }
    if(mail.indexOf("@") == -1)
    {
        alert("Error gelieve een correct email-adres in te vullen.");
        return;
    }
    
    var dansstijlInt = parseInt(document.getElementById("dansstijlDropdown").value);
    if(dansstijlInt == 0 )
    {
        alert("Error gelieve uw dansstijl aan te duiden. Dit is een verplicht veld.");
        return;
    }
    var dansstijl = GetDansstijlVoluit(dansstijlInt);
    
    var lesInt = parseInt(document.getElementById("lesDropdown").value);
    if(lesInt == 0 )
    {
        alert("Error gelieve uw les aan te duiden. Dit is een verplicht veld.");
        return;
    }
    var lesgroep = GetLesGroepVoluit(document.getElementById("lesDropdown").options[lesInt].innerText);
    
    
    $.ajax({
        type: "post",
        url: "http://localhost:3000/inschrijvingsFormulier/schrijfIn",
        data: JSON.stringify(
            { "voornaam": nm,
             "achternaam": anm,
             "leeftijd": leeft,
             "geslacht": geslacht,
             "mailadres": mail,
             "dansstijl": dansstijl,
             "lesgroep": lesgroep
            }),
        contentType: "application/json",
        dataType: 'json',
        //headers: {"Access-Control-Allow-Headers": "*"},
        complete: function(d, st){            
            if(d.responseText === "OK")
                {
                    annuleerFormulier();
                    alert("Uw inzending is goed ontvangen. Bedankt en tot snel!");
                }
            else{
                alert("Er is iets misgelopen.. Contacteer ons.");
            }
        }
    });
}

function GetDansstijlVoluit(dansint)
{
    if(dansint === 1)
    {
        return "Modern Jazz";
    }
    else if(dansint === 2)
    {
        return "Hiphop";
    }
    else if(dansint === 3)
    {
        return "Koppeldansen";
    }
    else if(dansint === 4)
    {
        return "Ballet";
    }
}

function dansstijlOnChangeEvent()
{
    document.getElementById("aantalPersonenInLes").innerText = "";
    
    var nieuweDansstijlInt = document.getElementById("dansstijlDropdown").value;
    setLesTypes(nieuweDansstijlInt);
}

function setDansType(dansTypeParam)
{
    let element = document.getElementById("dansstijlDropdown");
    element.value = dansTypeParam;
}

function setLesTypes(dansTypeParam)
{
    var lesDropdown = document.getElementById("lesDropdown");
    // huidige lestypes allemaal wissen:
    lesDropdown.innerHTML = "";
    
    // nieuwe lestypes toevoegen:
    var opt = document.createElement('option');
        opt.appendChild( document.createTextNode("-- Selecteer je les --") );
        opt.value = "0"; 
        lesDropdown.appendChild(opt);
    
    var lesArr = GetLesTypesArr(dansTypeParam);
    for(var i = 0 ; i < lesArr.length; i++)
    {
        var opt = document.createElement('option');
        opt.appendChild( document.createTextNode(lesArr[i]) );
        opt.value = (i+1).toString(); 
        lesDropdown.appendChild(opt);
    }
    
}

function lesOnChangeEvent() // doe ajax get call om aantal leden in de les te krijgen
{
    // geselecteerde les opvragen:
    var lesInt = parseInt(document.getElementById("lesDropdown").value);
    if(lesInt == 0 )
    {
        document.getElementById("aantalPersonenInLes").innerText = "";
        return;
    }
    var lesgroep = GetLesGroepVoluit(document.getElementById("lesDropdown").options[lesInt].innerText);
    
    // geselecteerde danles opvragen:
    var dansstijlInt = parseInt(document.getElementById("dansstijlDropdown").value);
    if(dansstijlInt == 0 )
    {
        document.getElementById("aantalPersonenInLes").innerText = "";
        return;
    }
    var dansstijl = GetDansstijlVoluit(dansstijlInt);
    
    
    
    // AJAX GET:
    $.ajax({
        type: "get",
        url: "http://localhost:3000/inschrijvingsFormulier/getAantalPerLes",
        data:  { "dansstijl": dansstijl,
             "lesgroep": lesgroep},
        //contentType: "application/json",
        dataType: 'json',
        complete: function(d, st){    
            
            if(d.statusText === "OK")
            {
                document.getElementById("aantalPersonenInLes").innerText = "Aantal personen die deze les al volgen: " + JSON.stringify(d.responseJSON);
            }
            else{
                alert("Er is een probleem opgestreden.. Contacteer ons.");
            }
        }
    });
}


function GetLesTypesArr(dtp)
{
    if(dtp === "0")
    {
        return [];
    }
    else if(dtp === "1")
    {
        return ["Les beginners op dinsdag van 19u30 tot 20u30", "Les gevorderden op zaterdag van 13u30 tot 15u30"];
    }
    else if(dtp === "2")
    {
        return ["Les beginners op woensdag van 19u30 tot 20u30", "Les gevorderden op woensdag van 20u30 tot 21u30"];
    }
    else if(dtp === "3")
    {
        return ["Les beginners op dinsdag van 17u30 tot 19u00", "Les gevorderden op dinsdag van 19u00 tot 21u30"];
    }
    else //if(dtp === 4)
    {
        return ["Les beginners op zaterdag van 14u30 tot 15u30", "Les gevorderden op zaterdag van 15u30 tot 16u30", "Les beginners Pointe op dinsdag van 17u00 tot 18u00", "Les gevorderden Pointe op dinsdag van 18u00 tot 19u00"];
    }
}

function GetLesGroepVoluit(txt)
{
    if(txt.toLowerCase().indexOf("beginner") > -1)
    {
        if(txt.toLowerCase().indexOf("pointe") > -1)
        {
            return "Beginner Pointe";
        }
        return "Beginner";
    }
    else if(txt.toLowerCase().indexOf("gevord") > -1)
    {
        if(txt.toLowerCase().indexOf("pointe") > -1)
        {
            return "Gevorderd Pointe";
        }
        return "Gevorderd";
    }
}