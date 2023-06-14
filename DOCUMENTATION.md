# [el-beeswarm](https://github.com/elvisthermo/el-beeswarm#readme)



## data(dataset)

null

### Parameters

| Name    | Types   | Description  |
| ------- | ------- | ------------ |
| dataset | dataset | dataset json |



## draw()

- função de desenho do grafico





## resize()

- função de redimencionar





## calculateSwarmPlotPositions(data, radius, padding, scale)

Calcula as posições dos pontos no gráfico de dispersão.

### Parameters

| Name    | Types  | Description                                   |
| ------- | ------ | --------------------------------------------- |
| data    | Array  | Os dados para os pontos.                      |
| radius  | number | O raio dos pontos.                            |
| padding | number | O espaçamento entre os pontos.                |
| scale   | Object | A escala utilizada para posicionar os pontos. |

### Returns

Array
As posições calculadas dos pontos.

## containForce(size, axis)

Aplica força para manter os pontos dentro dos limites do gráfico.

### Parameters

| Name | Types  | Description                                        |
| ---- | ------ | -------------------------------------------------- |
| size | number | O tamanho do eixo.                                 |
| axis | string | O eixo ao qual a força será aplicada ('x' ou 'y'). |

### Returns

function
Uma função de força para ser usada em uma simulação de força.

## draw()

Desenha o gráfico.



### Returns

Object
O elemento do grupo de pontos.

## drawAxis(x, y)

Desenha os eixos do gráfico.

### Parameters

| Name | Types  | Description         |
| ---- | ------ | ------------------- |
| x    | Object | A escala do eixo x. |
| y    | Object | A escala do eixo y. |



## drawCircles(element, positionedData, colors, positions)

Desenha os pontos no formato de círculo.

### Parameters

| Name           | Types    | Description                             |
| -------------- | -------- | --------------------------------------- |
| element        | Object   | O elemento SVG para desenhar os pontos. |
| positionedData | Array    | Os dados posicionados para os pontos.   |
| colors         | function | A função para obter a cor de um ponto.  |
| positions      | Array    | As posições x e y do ponto.             |

### Returns

Object
O elemento do grupo de pontos.

## drawDots(x, y)

Desenha os pontos no gráfico.

### Parameters

| Name | Types  | Description                 |
| ---- | ------ | --------------------------- |
| x    | Object | Os valores de coordenada x. |
| y    | Object | Os valores de coordenada y. |

### Returns

Object
O elemento do grupo de pontos.

## drawHex(element, positionedData, colors, positions)

Desenha pontos no formato hexagonal.

### Parameters

| Name           | Types    | Description                             |
| -------------- | -------- | --------------------------------------- |
| element        | Object   | O elemento SVG para desenhar os pontos. |
| positionedData | Array    | Os dados posicionados para os pontos.   |
| colors         | function | A função para obter a cor de um ponto.  |
| positions      | Array    | As posições x e y do ponto.             |

### Returns

Object
O elemento do grupo de pontos.

## intersects(x, y, head)

Verifica se um ponto intersecta outros pontos.

### Parameters

| Name | Types  | Description                          |
| ---- | ------ | ------------------------------------ |
| x    | number | A coordenada x do ponto.             |
| y    | number | A coordenada y do ponto.             |
| head | Object | O primeiro ponto na lista de pontos. |

### Returns

boolean
Retorna true se o ponto intersecta outros pontos, caso contrário, retorna false.

## prepareData()

Prepares the data and returns the x and y scales based on the orientation and attribute.



### Returns

Object
- The x and y scales.

## data(dataset)

null

### Parameters

| Name    | Types   | Description  |
| ------- | ------- | ------------ |
| dataset | dataset | dataset json |



## draw()

- função de desenho do grafico





## drawCircles(element, positionedData, colors)

Draws circles on the specified element based on the provided positioned data and colors.

### Parameters

| Name           | Types                           | Description                                      |
| -------------- | ------------------------------- | ------------------------------------------------ |
| element        | d3.Selection                    | The element to draw the circles on.              |
| positionedData | Array.&lt;Object&gt;            | The data with x and y positions for each circle. |
| colors         | Array.&lt;string&gt;, undefined | The colors for the circles.                      |

### Returns

d3.Selection
- The selection of the drawn circles.

## drawContainer()

- draw container initially in svg





## resize()

- função de redimencionar





## setColor(attribute, colors)

null

### Parameters

| Name      | Types | Description |
| --------- | ----- | ----------- |
| attribute | *     |             |
| colors    | *     |             |

Documentation generated with [doxdox](https://github.com/docsbydoxdox/doxdox)

Generated on Tue Jun 13 2023 21:05:56 GMT-0300 (Horário Padrão de Brasília)
