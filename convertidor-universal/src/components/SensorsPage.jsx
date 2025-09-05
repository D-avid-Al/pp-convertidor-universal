import { useState, useEffect } from "react";
import { realtimeDb } from "../firebase/config";
import { ref, onValue, off } from "firebase/database";
import {
  SensorLineChart,
  TemperatureGauge,
  PotentiometerGauge,
} from "./Charts";
import "./SensorsPage.css";

function SensorsPage() {
  const [sensorData, setSensorData] = useState({
    potenciometro: 0,
    temperatura: 0,
    timestamp: null,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("potenciometro");
  const [chartData, setChartData] = useState({
    potenciometro: [],
    temperatura: [],
  });

  useEffect(() => {
    // Conectar a Firebase Realtime Database
    const sensorRef = ref(realtimeDb, "sensores");

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSensorData({
            potenciometro: data.potenciometro || 0,
            temperatura: data.temperatura || 0,
            timestamp: new Date().toLocaleTimeString(),
          });
          setIsConnected(true);

          // Agregar al historial (mantener últimos 20 registros)
          setDataHistory((prev) => {
            const newEntry = {
              ...data,
              timestamp: new Date().toLocaleTimeString(),
              id: Date.now(),
            };
            return [newEntry, ...prev.slice(0, 19)];
          });

          // Actualizar datos para gráficos (mantener últimos 30 puntos)
          setChartData((prev) => ({
            potenciometro: [
              ...prev.potenciometro.slice(-29),
              data.potenciometro || 0,
            ],
            temperatura: [
              ...prev.temperatura.slice(-29),
              data.temperatura || 0,
            ],
          }));
        } else {
          setIsConnected(false);
        }
      },
      (error) => {
        console.error("Error reading sensor data:", error);
        setIsConnected(false);
      }
    );

    return () => {
      off(sensorRef, "value", unsubscribe);
    };
  }, []);

  const getPotentiometerPercentage = () => {
    return ((sensorData.potenciometro / 4095) * 100).toFixed(1);
  };

  const getTemperatureColor = (temp) => {
    if (temp < 10) return "#2196F3"; // Azul frío
    if (temp < 25) return "#4CAF50"; // Verde normal
    if (temp < 35) return "#FF9800"; // Naranja cálido
    return "#F44336"; // Rojo caliente
  };

  const getConnectionStatus = () => {
    return isConnected ? "🟢 Conectado" : "🔴 Desconectado";
  };

  const sensors = {
    potenciometro: {
      name: "Potenciómetro",
      icon: "🎛️",
      unit: "",
      range: "0 - 4095",
      getValue: () => sensorData.potenciometro,
      getDisplayValue: () => `${sensorData.potenciometro}`,
      getPercentage: () => ((sensorData.potenciometro / 4095) * 100).toFixed(1),
      getColor: () => "#667eea",
    },
    temperatura: {
      name: "Temperatura DS18B20",
      icon: "🌡️",
      unit: "°C",
      range: "-55°C a +125°C",
      getValue: () => sensorData.temperatura,
      getDisplayValue: () => {
        const temp = sensorData.temperatura;
        if (temp === 0 || temp === null || temp === undefined) {
          return "Sensor no detectado";
        }
        return `${temp.toFixed(1)}°C`;
      },
      getPercentage: () => {
        const temp = sensorData.temperatura;
        if (temp === 0 || temp === null || temp === undefined) {
          return 0;
        }
        // Escala de -10°C a 50°C para el porcentaje
        if (temp < -10) return 0;
        if (temp > 50) return 100;
        return (((temp + 10) / 60) * 100).toFixed(1);
      },
      getColor: (temp) => {
        if (temp === 0 || temp === null || temp === undefined) {
          return "#9E9E9E"; // Gris para sensor no detectado
        }
        if (temp < 0) return "#2196F3"; // Azul para frío extremo
        if (temp < 10) return "#03A9F4"; // Azul claro
        if (temp < 25) return "#4CAF50"; // Verde normal
        if (temp < 35) return "#FF9800"; // Naranja cálido
        return "#F44336"; // Rojo caliente
      },
    },
  };

  const currentSensor = sensors[selectedSensor];

  return (
    <div className="sensors-page">
      <header className="sensors-header">
        <div className="company-header">
          <h1>ET28 PP AG-COMPANY</h1>
          <p>Sistema de Monitoreo Industrial ESP32</p>
        </div>
        <div className="connection-status">Estado: {getConnectionStatus()}</div>
      </header>

      <main className="sensors-main">
        {/* Selector de sensores */}
        <div className="sensor-selector">
          <h3>Seleccionar Sensor:</h3>
          <div className="sensor-buttons">
            {Object.entries(sensors).map(([key, sensor]) => (
              <button
                key={key}
                onClick={() => setSelectedSensor(key)}
                className={`sensor-button ${
                  selectedSensor === key ? "active" : ""
                }`}
              >
                {sensor.icon} {sensor.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sección Visual con Gráficos */}
        <div className="visual-section">
          <div className="charts-grid">
            {/* Medidor Circular */}
            <div className="gauge-card">
              <h3>📊 Medidor en Tiempo Real</h3>
              <div className="gauge-wrapper">
                {selectedSensor === "potenciometro" ? (
                  <PotentiometerGauge value={sensorData.potenciometro} />
                ) : (
                  <TemperatureGauge temperature={sensorData.temperatura} />
                )}
              </div>
            </div>

            {/* Gráfico de Líneas */}
            <div className="line-chart-card">
              <h3>📈 Tendencia Temporal</h3>
              <div className="chart-wrapper">
                <SensorLineChart
                  data={chartData[selectedSensor]}
                  sensorType={selectedSensor}
                  color={currentSensor.getColor(currentSensor.getValue())}
                />
              </div>
            </div>
          </div>

          {/* Tabla del sensor seleccionado */}
          <div className="sensor-table-container">
            <div className="sensor-table">
              <div className="table-header">
                <h2>
                  {currentSensor.icon} {currentSensor.name}
                </h2>
                <div className="sensor-status">
                  <span
                    className="status-indicator"
                    style={{
                      backgroundColor: isConnected ? "#4CAF50" : "#F44336",
                    }}
                  ></span>
                  {isConnected ? "Activo" : "Inactivo"}
                </div>
              </div>

              <div className="table-content">
                <div className="sensor-display">
                  <div
                    className="sensor-value-large"
                    style={{
                      color: currentSensor.getColor(currentSensor.getValue()),
                    }}
                  >
                    {currentSensor.getDisplayValue()}
                  </div>
                  <div className="sensor-percentage">
                    {currentSensor.getPercentage()}%
                  </div>
                </div>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${currentSensor.getPercentage()}%`,
                      backgroundColor: currentSensor.getColor(
                        currentSensor.getValue()
                      ),
                    }}
                  ></div>
                </div>

                <div className="sensor-info">
                  <div className="info-row">
                    <span className="info-label">Rango:</span>
                    <span className="info-value">{currentSensor.range}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Valor actual:</span>
                    <span className="info-value">
                      {currentSensor.getValue()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Última actualización:</span>
                    <span className="info-value">
                      {sensorData.timestamp || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección PLC I/O */}
        <div className="plc-section">
          <h3>🔌 Entradas y Salidas PLC</h3>
          <div className="plc-grid">
            <div className="plc-inputs">
              <h4>📥 Entradas Digitales</h4>
              <div className="io-grid">
                {[34, 35, 36, 39].map((pin, index) => (
                  <div key={pin} className="io-item">
                    <span className="io-label">
                      IN{index + 1} (GPIO{pin})
                    </span>
                    <div className="io-status">
                      <span className="status-dot"></span>
                      <span className="status-text">Simulado</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="plc-outputs">
              <h4>📤 Salidas Digitales</h4>
              <div className="io-grid">
                {[25, 26, 27, 33].map((pin, index) => (
                  <div key={pin} className="io-item">
                    <span className="io-label">
                      OUT{index + 1} (GPIO{pin})
                    </span>
                    <div className="io-status">
                      <span className="status-dot"></span>
                      <span className="status-text">Simulado</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="system-info-section">
          <h3>⚙️ Información del Sistema</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>🌐 Configuración WiFi</h4>
              <div className="info-details">
                <div className="info-row">
                  <span>AP de Configuración:</span>
                  <span>Config_ESP32</span>
                </div>
                <div className="info-row">
                  <span>Contraseña AP:</span>
                  <span>12345678</span>
                </div>
                <div className="info-row">
                  <span>Reset WiFi:</span>
                  <span>Mantener GPIO0 por 10s</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h4>📡 Comunicación</h4>
              <div className="info-details">
                <div className="info-row">
                  <span>Frecuencia de envío:</span>
                  <span>Cada 5 segundos</span>
                </div>
                <div className="info-row">
                  <span>Base de datos:</span>
                  <span>Firebase Realtime</span>
                </div>
                <div className="info-row">
                  <span>Protocolo:</span>
                  <span>HTTP PUT</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h4>🔧 Hardware</h4>
              <div className="info-details">
                <div className="info-row">
                  <span>Microcontrolador:</span>
                  <span>ESP32</span>
                </div>
                <div className="info-row">
                  <span>Potenciómetro:</span>
                  <span>GPIO32 (ADC)</span>
                </div>
                <div className="info-row">
                  <span>Temperatura:</span>
                  <span>DS18B20 (GPIO4)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de datos */}
        <div className="history-section">
          <h3>📊 Historial de Datos</h3>
          <div className="history-container">
            {dataHistory.length === 0 ? (
              <p className="no-data">Esperando datos del ESP32...</p>
            ) : (
              <div className="history-list">
                {dataHistory.map((entry) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-time">{entry.timestamp}</div>
                    <div className="history-data">
                      <span className="data-item">
                        🎛️ {entry.potenciometro} (
                        {((entry.potenciometro / 4095) * 100).toFixed(1)}%)
                      </span>
                      <span className="data-item">
                        🌡️ {entry.temperatura.toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información del ESP32 */}
        <div className="esp32-info">
          <h3>🔧 Información del ESP32</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>IP del ESP32:</strong>
              <span>Configuración vía AP "Config_ESP32"</span>
            </div>
            <div className="info-item">
              <strong>Frecuencia de envío:</strong>
              <span>Cada 5 segundos</span>
            </div>
            <div className="info-item">
              <strong>Base de datos:</strong>
              <span>Firebase Realtime Database</span>
            </div>
            <div className="info-item">
              <strong>Reset WiFi:</strong>
              <span>Mantener botón GPIO0 por 10 segundos</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SensorsPage;
