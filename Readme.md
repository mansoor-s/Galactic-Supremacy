# Galactic Supremacy

Galactic Supremacy is a an open source (MMORTS/Empire) Massive Multiplayer Online - Real Time Stratagy and Empire management game built for the web.


##Gameplay##

Everything is in one giant, beautiful spiral galaxy. The player can zoom in to see a single turret of a destroyer or zoom out to view the political situation in the immediate section of the galaxy, or keep zooming out to a full view of the entire galaxy. All seamlessly, just by just scrolling his mouse.

Players start out on a single planet, from which they must build infrastructure and a sustainable economy. After which, they must research space technology and start colonizing other planet, moons, astroids and eventually other star systems. They can establish trade routes with other players. These trade routes can be attacked by sponsored pirates and/or guarded by hired security forces. 

Players can also take over other players' planets and star systems. This is where millitary conflict comes in.

Space battles take place in a fully 3D environment, where ships can be moved in X, Y, and Z axes (think Homeworld). This introduces many new factors to take into acount when planning a move.

All of this in ONE single galaxy. Anything one player does can and will affect every other player in the galaxy. 

Players are in alliances. and alliances can have three relationships towards other alliances: Enemy, Non-Aggression-Pact, None




##Technology##


For the front end, **WebGL**(using **Three.js**) is used to deliver 3D hardware accelerated graphics in the browser. 

The server side is being written **c++** and is backed by Riak.
The website and utility programs are written in JS on Node.js.

Communication between server and client is done via WebSockets for reduced overhead and latency.





##Demo
Some very early work in progress demos: Use arrow keys for camera movements and mouse scroll for zoom
Galaxy view
http://mansoorsayed.com/gs2/
Starsystem view
http://mansoorsayed.com/Galactic-Supremacy/


##TODO:
More documentation



##Licence##
This project is released under the terms and conditions of the (AGPL) GNU AFFERO GENERAL PUBLIC LICENSE.