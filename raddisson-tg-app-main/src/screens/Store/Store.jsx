import React from "react";
import { ContentMiddleIos } from "../../components/ContentMiddleIos";
import "./style.css";

// Импорты изображений
import spaImage from "../../images/spa.jpg";
import restaurantsImage from "../../images/restoraunts.webp";
import roomServiceImage from "../../images/room-service.jpg";
import eventsImage from "../../images/events.jpg";
import transferImage from "../../images/transfer.jpeg";
import washingMachineImage from "../../images/washing-machine.jpg";

export const Store = () => {
  return (
    <div className="store" data-model-id="1:151">
      <div className="navigation-bar" />

      <div className="section">
        <div className="headline">
          <div className="frame">
            <p className="text-wrapper">
              Добро пожаловать
              <br />в Radisson&nbsp;&nbsp;Hotels &amp; Resorts!
            </p>
          </div>
        </div>
      </div>

      <div className="div-wrapper" data-colors-mode="dark">
        <div className="div">Выберите, что вас интересует</div>
      </div>

      <div className="container">
        <div 
          className="card"
          style={{ backgroundImage: `url(${spaImage})` }}
        >
          <ContentMiddleIos
            className="content-middle-ios-2"
            divClassName="content-middle-ios-2-instance"
            hasSecondaryTitle={false}
            textLayoutClassName="content-middle-ios-instance"
            title={
              <>
                Fitness <br />
                &amp; Spa
              </>
            }
          />
        </div>

        <div 
          className="card"
          style={{ backgroundImage: `url(${restaurantsImage})` }}
        >
          <ContentMiddleIos
            className="content-middle-ios-2"
            divClassName="content-middle-ios-2-instance"
            hasSecondaryTitle={false}
            textLayoutClassName="content-middle-ios-instance"
            title={
              <>
                Рестораны <br />и бары
              </>
            }
          />
        </div>
      </div>

      <div className="container">
        <div 
          className="card"
          style={{ backgroundImage: `url(${roomServiceImage})` }}
        >
          <ContentMiddleIos
            className="content-middle-ios-2"
            divClassName="design-component-instance-node"
            hasSecondaryTitle={false}
            title="Room Service"
          />
        </div>

        <div 
          className="card"
          style={{ backgroundImage: `url(${eventsImage})` }}
        >
          <ContentMiddleIos
            className="content-middle-ios-2"
            divClassName="content-middle-ios-2-instance"
            hasSecondaryTitle={false}
            textLayoutClassName="content-middle-ios-instance"
            title={
              <>
                Досуг <br />и события
              </>
            }
          />
        </div>
      </div>

      <div className="container">
        <div 
          className="card"
          style={{ backgroundImage: `url(${transferImage})` }}
        >
          <ContentMiddleIos
            className="content-middle-ios-2"
            divClassName="content-middle-ios-2-instance"
            hasSecondaryTitle={false}
            textLayoutClassName="content-middle-ios-instance"
            title={
              <>
                Трансферы
                <br />и аренда авто
              </>
            }
          />
        </div>

        <div 
          className="card"
          style={{ backgroundImage: `url(${washingMachineImage})` }}
        >
          <ContentMiddleIos
            className="content-middle-ios-2"
            divClassName="content-middle-ios-2-instance"
            hasSecondaryTitle={false}
            textLayoutClassName="content-middle-ios-instance"
            title={
              <>
                Химчистка
                <br />
                Прачечная
                <br />
                Глажка
              </>
            }
          />
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};
