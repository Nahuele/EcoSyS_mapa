# Acerca de

Proyecto de Mapa ecológico de Arg.

Permite explorar proyectos locales relacionados con el medioambiente (incluyendo info, fotos, videos, detalles de los integrantes, etc.).

Para agregar un proyecto debe crearse un usuario, luego podrá ingresar proyectos dentro de las siguientes categorías:
- Conservación de Fauna
- Conservación de Flora
- Agroecología y Soberanía Alimentaria
- Ambiente y Sociedad

Cada proyecto se mostrará con un ícono en el mapa en las coordenadas proporcionadas por el autor.

![image](https://i.imgur.com/FZmsCW3.png)

![image](https://i.imgur.com/HJlO6Fo.png)


## Instrucciones para instalar

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

`git clone https://gitlab.com/Nahuele/EcoMapa`

- Situarse en la carpeta donde está el proyecto y ejecutar:

`npm install` (esto instala los paquetes en la carpeta node_modules que no está en el git)


`npm run start` (esto lee el archivo package.json en la parte de script) es equivalente a: `ng serve`

Así arranca el server local en el puerto 4200. Cuando termina de compilar si entramos a la dirección http://localhost:4200/ veremos a nuestra página web.

Luego editar el código con tu editor favorito, por ejemplo Visual Studio Code.

### Como actualizar el repositorio:

- Comprobamos el remoto y su url: `git remote -v`
- Checkeamos el estado: `git status`
- Si esta en rojo los agregamos en memoria: `git add .`
- Si escribimos otra vez `git status` y salen en verde ya podemos commitear: `git commit -m 'mis cambios'`
- Y ahora podemos incorporar cambios nuevos de otras personas: `git pull origin master` (reemplazar origin con el nombre que corresponda cuando escribimos `git remote`)
