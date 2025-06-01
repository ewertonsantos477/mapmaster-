// O código JavaScript do mapa será copiado para este arquivo
// (É o mesmo conteúdo do bloco <script> que estava dentro do seu HTML do mapa)

let map;
let pontosRota = [];
let rotaLayer;
let rotas = [];
let marcadores = [];

// Ícones customizados
const icones = {
    'Polícia': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1531/1531870.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Radar': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/625/625796.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Buraco': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/565/565099.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Semáforo': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1071/1071168.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Acidente': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1531/1531876.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Alagamento': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3034/3034639.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Posto': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2852/2852701.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Hospital': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3034/3034720.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Restaurante': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3034/3034731.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    }),
    'Outro': L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3034/3034763.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    })
};

function iniciarMapa() {
    map = L.map('map').setView([-22.3855, -41.7828], 13); // Coordenadas aproximadas de Macaé

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adicionar controle de geocodificação
    L.Control.geocoder().addTo(map);

    // Adicionar um evento de clique no mapa para adicionar pontos de rota
    map.on('click', function(e) {
        pontosRota.push([e.latlng.lat, e.latlng.lng]);
        if (rotaLayer) {
            map.removeLayer(rotaLayer);
        }
        rotaLayer = L.polyline(pontosRota, { color: document.getElementById('routeColor').value }).addTo(map);
    });

    document.getElementById('addRoutePoint').addEventListener('click', function() {
        // O ponto já é adicionado ao clicar no mapa, este botão pode ser removido ou ter outra função
        alert('Clique no mapa para adicionar pontos à rota.');
    });

    document.getElementById('clearRoute').addEventListener('click', function() {
        if (rotaLayer) {
            map.removeLayer(rotaLayer);
        }
        pontosRota = [];
        alert('Rota limpa.');
    });

    document.getElementById('saveRoute').addEventListener('click', function() {
        const routeName = document.getElementById('routeName').value.trim();
        const routeColor = document.getElementById('routeColor').value;

        if (pontosRota.length < 2) {
            alert('Adicione pelo menos dois pontos para salvar uma rota.');
            return;
        }
        if (!routeName) {
            alert('Por favor, dê um nome para a rota.');
            return;
        }

        const newRoute = {
            nome: routeName,
            pontos: pontosRota,
            cor: routeColor,
            layer: L.polyline(pontosRota, { color: routeColor }).addTo(map)
        };
        rotas.push(newRoute);
        pontosRota = []; // Limpa os pontos temporários para a próxima rota
        if (rotaLayer) {
            map.removeLayer(rotaLayer);
        }
        document.getElementById('routeName').value = ''; // Limpa o campo de nome
        atualizarListaRotas();
        salvarDados();
        alert(`Rota "${routeName}" salva com sucesso!`);
    });

    document.getElementById('addMarker').addEventListener('click', function() {
        const markerType = document.getElementById('markerType').value;
        const center = map.getCenter();
        const marker = L.marker(center, { icon: icones[markerType] }).addTo(map).bindPopup(markerType);
        marcadores.push({
            tipo: markerType,
            marker: marker
        });
        atualizarListaMarcadores();
        salvarDados();
        alert(`Marcador de "${markerType}" adicionado no centro do mapa.`);
    });

    function atualizarListaRotas() {
        const rotasList = document.getElementById('rotasList');
        rotasList.innerHTML = '';
        rotas.forEach((rota, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${rota.nome}</span>
                <button onclick="removerRota(${index})">Remover</button>
            `;
            rotasList.appendChild(li);
        });
    }

    window.removerRota = function(index) {
        const rotaRemover = rotas[index];
        if (rotaRemover.layer) {
            map.removeLayer(rotaRemover.layer);
        }
        rotas.splice(index, 1);
        atualizarListaRotas();
        salvarDados();
        alert(`Rota removida.`);
    };

    function atualizarListaMarcadores() {
        const marcadoresList = document.getElementById('marcadoresList');
        marcadoresList.innerHTML = '';
        marcadores.forEach((marcador, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${marcador.tipo} (${marcador.marker.getLatLng().lat.toFixed(4)}, ${marcador.marker.getLatLng().lng.toFixed(4)})</span>
                <button onclick="removerMarcador(${index})">Remover</button>
            `;
            marcadoresList.appendChild(li);
        });
    }

    window.removerMarcador = function(index) {
        const marcadorRemover = marcadores[index];
        if (marcadorRemover.marker) {
            map.removeLayer(marcadorRemover.marker);
        }
        marcadores.splice(index, 1);
        atualizarListaMarcadores();
        salvarDados();
        alert(`Marcador removido.`);
    };

    // Funcionalidade de alternar a sidebar
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    let isSidebarOpen = true; // Sidebar começa aberta

    toggleSidebarBtn.addEventListener('click', () => {
        if (isSidebarOpen) {
            sidebar.style.right = '-300px'; // Esconde a sidebar
            toggleSidebarBtn.style.right = '10px'; // Move o botão para a direita
        } else {
            sidebar.style.right = '0'; // Mostra a sidebar
            toggleSidebarBtn.style.right = '320px'; // Move o botão de volta
        }
        isSidebarOpen = !isSidebarOpen;
    });

    // Funcionalidade de pesquisa
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query) {
                // Usando o geocodificador do Leaflet Control Geocoder
                L.Control.Geocoder.nominatim().geocode(query, function(results) {
                    if (results && results.length > 0) {
                        const latlng = results[0].center;
                        map.setView(latlng, 15); // Centraliza o mapa no resultado
                        L.marker(latlng).addTo(map).bindPopup(results[0].name).openPopup();
                    } else {
                        alert('Local não encontrado.');
                    }
                });
            }
        }
    });

    carregarDados(); // Carrega os dados ao iniciar o mapa
}

function salvarDados() {
    // Prepara as rotas para salvar (apenas dados necessários, sem o objeto Leaflet 'layer')
    const rotasParaSalvar = rotas.map(rota => ({
        nome: rota.nome,
        pontos: rota.pontos,
        cor: rota.cor
    }));
    localStorage.setItem('rotasMapa', JSON.stringify(rotasParaSalvar));

    // Prepara os marcadores para salvar (apenas dados necessários, sem o objeto Leaflet 'marker')
    const marcadoresParaSalvar = marcadores.map(m => ({
        tipo: m.tipo,
        latlng: m.marker.getLatLng() // Salva a latitude e longitude do marcador
    }));
    localStorage.setItem('marcadoresMapa', JSON.stringify(marcadoresParaSalvar));
    console.log("Dados salvos automaticamente!");
}

function carregarDados() {
    const rotasSalvas = JSON.parse(localStorage.getItem('rotasMapa') || '[]');
    rotas = rotasSalvas.map(rota => {
        const polyline = L.polyline(rota.pontos, { color: rota.cor }).addTo(map);
        return {
            nome: rota.nome,
            pontos: rota.pontos,
            cor: rota.cor,
            layer: polyline
        };
    });
    atualizarListaRotas(); // Atualiza a lista exibida na UI

    const marcadoresSalvos = JSON.parse(localStorage.getItem('marcadoresMapa') || '[]');
    marcadores = marcadoresSalvos.map(m => {
        const marker = L.marker(m.latlng, { icon: icones[m.tipo] }).addTo(map).bindPopup(m.tipo);
        return {
            tipo: m.tipo,
            marker: marker
        };
    });
    atualizarListaMarcadores(); // Atualiza a lista exibida na UI
    console.log("Dados carregados automaticamente!");
}

iniciarMapa();