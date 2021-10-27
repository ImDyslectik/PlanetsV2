in het eerste stuk worden er variabelen aangemaakt en const zodat we dat later niet
hoeven te defineren ook word de three.js library geimporteerd

daarna wacht het script totdat de startbutton is geklikt en zo ja dan
word de overlay verwijderd en word het scherm zichtbaar met de objecten

in de renderer word de three.webgl aangemaakt en word anti aliasinbg aangezet
met daarnaast ook het formaat van het scherm en de achtergrond kleur 

dan bij de texture loader worden er normalmaps ingeladen van verschillende planeten om 
textures te geven aan de materials die we later gebruiken

create canvas en emmisive worden gebruikt om ten eerste het canvas aan te maken
en daarna om emmisive map toe te voegen zodat dit later gebruikt kan worden
tot slot scene aangemaakt

dan beginnen we met het aanmaken van de galaxy door het materiaal eigenschappen te geven
daarna maken we de geometry aan en voegen dit toe aan een mesh
dit doen we dan 50000 keer en om alles een andere positie mee te geven doen we dit in
een for loop en dit geven we als punten mee met de naam galaxy en galaxy2

elke planeet heeft een ...Geo dus geometry met positie en de hoeken van de cirkel
daarnaast hebben ze een mesh ofterwel een mat(eriaal) met de kleur en eigenschappen maar die heb ik eronder gezet
tot slot komt het samen tot de planeetmesh waarin dus bovenstaande eigenschappen worden meegegeven
en zon 1 en 2 hebben een emmisive map en emmision als eigenschap zodat het lijkt alsof het een zon is/ meer gloeit
en zon 2 heeft identieke eigenschappen en dezelfde locatie zodat de 2 spheres door elkaar heen clippen wat er best wel cool uitziet

functie randompos geeft voor de hoeveelheid in planetencount een mesh mee en
maakt dan een willekeurige positie aan en zo komen er ... keer planeten in de demo

randomlight doet daarna hetzelfde maar ivm tijdsgebrek aangezien de bedoeling was
om meerdere lichtbronnen willekeurig aan te maken dus nu worden er alleen rode planeten aangemaakt
dan nog een ambientlight zodat het schip zelfs in het donker een beetje contour heeft

vervolgens worden er wat planeten aangemaakt met unieke normal maps en posities dit word
dan weer toegevoegd aan een groep en die groep word toegevoegd aan animaties en de scene

mouse move ding zorgt ervoor dat we de camera kunnen bewegen een beetje scuffed maar het gaat om het idee

daarna de objectloaders 1 voor het main schip waar je vanuit kijkt en 1 loader
die wat andere schepen inlaad zodat het er wat gezellig uitziet

L1 L2 etc zijn de lichtbronnen die worden toegevoegd

resize zorgt ervoor dat de demo altijd goed in beeld blijft zelfs na het verplaatsen van het schermvlak
daarna word de camera nog gespecificeerd 

dan nog een music player om atmosfeer toe te voegen

tick heeft de functie om altijd te blijven refreshen
hierin bevinden zich de planeet rotaties omdat dit altijd geupdate moet worden
stats is voor de fps counter
binnen tick zijn dingen die animeren eigenlijks alleen dus beweging van planeten en de schepen