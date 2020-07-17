# Acerca de

Proyecto de Mapa ecológico de Arg.

![image](http://i.imgur.com/1Zrlbal.png)


## Instrucciones

Para correr y editar local (al menos en Linux):

- Instalar `npm` [npm info](https://nodejs.org/en/) 


- Luego instalar **angular** en la computadora (con la opción -g (global) ).
 Mas info en [Install angular](https://angular.io/guide/setup-local)

`npm install -g @angular/cli`

- Después instalar [Typescript](https://www.npmjs.com/package/typescript)

`npm install -g typescript`

- Instalar git (es opcional, yo lo recomiendo, pero sino se puede descargar la carpeta del codigo sin usar Git) [Install en Linux, solo la parte Installing Git with Apt y Configuring Git](https://linuxize.com/post/how-to-install-git-on-ubuntu-18-04/)


- Si optamos usar Git:

    Clonar el Repositorio del Proyecto en alguna carpeta con el comando:

`git clone https://gitlab.com/Nahuele/ianchuproject`

- Situarse en la carpeta donde está el proyecto y ejecutar:

`npm install` (esto instala los paquetes en la carpeta node_modules que no está en el git)


`npm run start` (esto lee el archivo package.json en la parte de script) es equivalente a: `ng serve`

Así arranca el server local en el puerto 4200. Cuando termina de compilar si entramos a la dirección http://localhost:4200/ veremos a nuestra página web.

Luego editar el código con tu editor favorito, por ejemplo Visual Studio Code.

