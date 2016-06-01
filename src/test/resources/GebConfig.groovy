import org.openqa.selenium.firefox.FirefoxBinary
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.firefox.FirefoxProfile
import org.openqa.selenium.Dimension

driver = {
  def profile = new FirefoxProfile()
  profile.setEnableNativeEvents(true)
  def binary = new FirefoxBinary(new File("/Applications/Firefox.app/Contents/MacOS/firefox-bin"));
//  def binary = new FirefoxBinary(new File("/Applications/Firefox28.app/Contents/MacOS/firefox-bin"));
  def driver = new FirefoxDriver(binary, profile)
  driver.manage().window().setSize(new Dimension(1040, 850))
  return driver
}
baseUrl = "http://localhost:8080/index.html"
reportsDir = "target/test-reports/geb"
