// busca os dados na api (ou arquivo)
async function getData() {
  // const makeupLst = fetch("http://makeup-api.herokuapp.com/api/v1/products.json");
  let data = await fetch("data/products.json");
  let jsonData = await data.json();
  return jsonData;
}

// montando o data grid
async function setGrid(data) {
  const gridTag = document.getElementById("grid");
  gridTag.innerHTML = "";
  data.sort((a, b) => {
    if (a.rating === b.rating) {
      return 0;
    } else if (a.rating === null) {
      return 1;
    } else if (b.rating === null) {
      return -1;
    } else {
      return a.rating < b.rating ? 1 : -1;
    }
  });

  data.forEach(async (element) => {
    // console.log(element.rating, element.name, element.id);
    // cria a div principal que irá mostrar o elemento
    const mainDiv = document.createElement("div");
    mainDiv.style.width = "220px";
    mainDiv.style.height = "380px";
    mainDiv.classList.add("card");
    mainDiv.style.margin = "10px";
    // div filha que irá ter outros elementos como título e imagem
    const childDiv = document.createElement("div");
    childDiv.classList.add("card-body");
    // imagem da maquiagem
    const img = document.createElement("img");
    await checkImg(element.image_link, img);
    img.classList.add("figure-img", "img-fluid", "rounded");
    // título da maquiagem
    const title = document.createElement("span");
    title.classList.add("card-title", "fw-semibold");
    title.textContent = element.name;
    // div para imagem e título
    const divImgTit = document.createElement("div");
    divImgTit.appendChild(img);
    divImgTit.appendChild(title);
    // marca
    const marca = document.createElement("span");
    marca.textContent = element.brand;
    marca.classList.add("badge", "text-bg-secondary");
    // preço
    const preco = document.createElement("span");
    preco.textContent = `R$${
      (element.price * 5).toFixed(2).replace(".", ",") || 0
    }`;
    preco.classList.add("badge", "text-bg-primary");
    preco.style.marginLeft = "8px";
    //div para brand e preço
    const brandPreco = document.createElement("div");
    brandPreco.appendChild(marca);
    brandPreco.appendChild(preco);
    // anexando os elementos
    mainDiv.appendChild(childDiv);
    childDiv.appendChild(divImgTit);
    childDiv.appendChild(brandPreco);
    gridTag.appendChild(mainDiv);
  });
}

// cheaca se a imagem está disponível ou colocar uma imagem default
async function checkImg(imgUrl, i) {
  await fetch(imgUrl, { method: "HEAD" })
    .then((res) =>
      res.ok ? (i.src = res.url) : (i.src = "img/unavaliable.png")
    )
    .catch((err) => (i.src = "img/unavailable.png"));
}

// procura item
const searchMakeUP = document.getElementById("searchMakeUP");
searchMakeUP.addEventListener("input", searchMakeUPFn);
function searchMakeUPFn() {
  const valueFilter = searchMakeUP.value;
  const newDataArr = dataGrid.filter((item) =>
    item.name.toLowerCase().includes(valueFilter.toLowerCase())
  );
  console.log(newDataArr);
  setGrid(newDataArr);
}

// variável global
var dataGrid = [];
// método de inicialização da página
init();

function init() {
  // coletando todos os dados
  getData().then((res) => {
    setGrid(res);
    dataGrid = res;
  });
}
