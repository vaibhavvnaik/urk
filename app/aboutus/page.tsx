import Container from "../components/Container";

const AboutUsPage = () => {
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-2 border-b-[1px]">
        <Container>
          <div
            className="
              flex
              flex-row
              items-center
              justify-between
              gap-3
              md:gap-0
            "
          >
            <div>
              <a href="/terms.html">Terms</a>
            </div>
            <div>
              <a href="/privacy.html">Privacy Policy</a>
            </div>
            <div>
              <a href="/privacy">Cookies</a>
            </div>
            <div>
              <a href="/privacy">Disclaimer</a>
            </div>
            <div>
              <a href="/privacy">Contact Us</a>
            </div>
          </div>
        </Container>
      </div>
      <hr />
    </div>
  );
};

export default AboutUsPage;
