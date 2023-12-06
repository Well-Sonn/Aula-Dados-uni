# Cotação de Transporte
Projeto academico web para calcular a cotação de transporte entre diferentes cidades. 

Este é um projeto web para calcular a cotação de transporte entre diferentes cidades. O projeto inclui uma interface simples, onde os usuários podem selecionar a origem e o destino para obter informações sobre a distância, custo total, tempo estimado de viagem e datas de saída e chegada. Além disso, há a integração com a API do Google Maps para visualizar a rota no mapa.

### Instruções de Uso:
Abra o arquivo index.html em um navegador da web.
Selecione a cidade de origem e destino nos menus suspensos.
Clique no botão "Consultar" para calcular a distância, custo, tempo estimado e exibir a rota no mapa.
Utilize o botão "Limpar" para redefinir o formulário e os resultados.

### Estrutura do Projeto:
index.html: Arquivo principal da interface do usuário.
css/index.css: Folha de estilo para estilizar a página.
js/index.js: Script JavaScript para funcionalidades interativas.
csv/dados-transporte.json: Arquivo JSON contendo dados sobre as cidades e coordenadas geográficas.
README.md: Documentação sobre o projeto (este arquivo).

### Sobre o Código:
O projeto utiliza XMLHttpRequest para carregar os dados JSON sobre as cidades.
As funções JavaScript realizam cálculos de distância, custo e tempo estimado com base nas coordenadas geográficas das cidades.
A API do Google Maps é integrada para exibir a rota no mapa.
