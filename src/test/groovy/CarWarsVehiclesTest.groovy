import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import geb.junit4.GebReportingTest
import org.junit.Test

@RunWith(JUnit4)
class CarWarsVehiclesTest extends GebReportingTest {
    void startApp() {
        go()
        at LoadingPage
        newDesignLink.click()
        at NewVehiclePage
    }

    @Test
    void testCar() {
        startApp()
        newCar.click()
        at DefaultPage
        toolbarBodyButton.click()
        assert modelType() == 'Car'
        assert diagramType() == 'Car'
        assert hasBody('Subcompact')
        assert !hasBody('Compact')
        assert !modelRaceCar()
        assert modelTechLevel() == 'Classic'
    }

    @Test
    void testRaceCar() {
        startApp()
        newRaceCar.click()
        diagramBody.click()
        at BodyPage
        assert modelType() == 'Car'
        assert diagramType() == 'Car'
        assert hasBody('Sprint')
        assert modelRaceCar()
        assert modelTechLevel() == 'CWC'
    }

    @Test
    void testCycle() {
        startApp()
        newCycle.click()
        toolbarBodyButton.click()
        assert modelType() == 'Cycle'
        assert diagramType() == 'Cycle'
        assert hasBody('Light Cycle')
        assert modelTechLevel() == 'Classic'
    }

    @Test
    void testTrike() {
        startApp()
        newTrike.click()
        toolbarBodyButton.click()
        assert modelType() == 'Trike'
        assert diagramType() == 'Trike'
        assert hasBody('Light Trike')
        assert modelTechLevel() == 'Classic'
    }

    @Test
    void testCarTrailer() {
        startApp()
        newCarTrailer.click()
        toolbarBodyButton.click()
        assert modelType() == 'CarTrailer'
        assert diagramType() == 'CarTrailer'
        assert hasBody('Mini-Van')
        assert modelTechLevel() == 'CWC'
    }

    @Test
    void testTenWheeler() {
        startApp()
        newTenWheeler.click()
        toolbarBodyButton.click()
        assert modelType() == 'TenWheeler'
        assert diagramType() == 'TenWheeler'
        assert hasBody('Cabover')
        assert modelTechLevel() == 'CWC'
    }

    @Test
    void testSemiTractor() {
        startApp()
        newSemiTractor.click()
        toolbarBodyButton.click()
        assert modelType() == 'SemiTractor'
        assert diagramType() == 'SemiTractor'
        assert hasBody('Standard Cabover')
        assert modelTechLevel() == 'CWC'
    }

    @Test
    void testSemiTrailer() {
        startApp()
        newSemiTrailer.click()
        toolbarBodyButton.click()
        assert modelType() == 'SemiTrailer'
        assert diagramType() == 'SemiTrailer'
        assert hasBody('Van')
        assert modelTechLevel() == 'CWC'
    }

    @Test
    void testBus() {
        startApp()
        newBus.click()
        toolbarBodyButton.click()
        assert modelType() == 'Bus'
        assert diagramType() == 'Bus'
        assert hasBody('Minibus')
        assert modelTechLevel() == 'CWC'
    }
}
