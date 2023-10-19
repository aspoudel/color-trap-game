import React from "react";
import "./About.css";
import NavigationBar from "../NavigationBar/NavigationBar";

export default function About() {
  return (
    <div>
      <NavigationBar />
      <div className="cobras-about">
        <h1>Cobra's Den</h1>
        <div className="scrollable">
          <h3 className="the-game">The Game</h3>
          <p>
            A memory game meant for people of all ages to improve their short
            term memory and to spend times with friend, families and people from
            around the world. The game was built entirely from imagination and
            real life inspirations.
          </p>
          <p>
            Connect with the developer:{" "}
            <a href="http://www.linkedin.com/in/adarshsharmap" target="_blank">
              LinkedIn
            </a>
          </p>
          <p>© 2023 www.colortrapgame.com</p>
          <p>© 2023 www.colourtrapgame.com</p>
          <div>
            <h3>Terms of Use</h3>
            <p>
              People of any age who have reached the threshold mental ability to
              recognize and memorize colors for a short period of time can play
              this game.
            </p>
          </div>
          <div>
            <h3>Privacy Policy</h3>
            <p>
              We do not directly collect any data but the third party
              advertising agency /agencies that we collaborate with may collect
              basic information such as IP address, GPS location etc to provide
              suitable ads to the users.
            </p>
          </div>
          <div>
            <h3>Discalimer</h3>
            <p>
              This game and its contents are meant to be for entertainment
              purposes only. Anything in the game is not to be taken seriously
              or with offense.
            </p>
          </div>
          <div>
            <h3>Credits</h3>
            <p>Sound from Zapsplat.com</p>
            <p>
              <a
                target="_blank"
                href="https://www.freepik.com/free-vector/illustration-global-icon_2687446.htm#query=world%20map&position=0&from_view=keyword&track=ais"
              >
                Image by rawpixel.com
              </a>
              on Freepik
            </p>
            <p>
              Photo by
              <a
                target="_blank"
                href="https://unsplash.com/@sumekler?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              >
                Jarosław Kwoczała
              </a>
              on
              <a
                target="_blank"
                href="https://unsplash.com/photos/iJoXOM4J9fE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              >
                Unsplash
              </a>
            </p>
            <p>
              Image by
              <a
                target="_blank"
                href="https://pixabay.com/users/realth4-3688152/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1854436"
              >
                태형 김
              </a>
              from
              <a
                target="_blank"
                href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1854436"
              >
                Pixabay
              </a>
            </p>
            <p>
              Image by
              <a
                target="_blank"
                href="https://pixabay.com/users/publicdomainpictures-14/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=316657"
              >
                PublicDomainPictures
              </a>
              from
              <a
                target="_blank"
                href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=316657"
              >
                Pixabay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
