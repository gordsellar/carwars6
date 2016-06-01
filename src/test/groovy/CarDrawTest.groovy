import org.junit.runner.RunWith
import org.junit.runners.JUnit4
import geb.junit4.GebReportingTest
import org.junit.Test

@RunWith(JUnit4)
class CarDrawTest extends GebReportingTest {
    @Test public void doNothing() {}
//    @Test
//    public void testCycleRider() {
//        go()
//        at DefaultPage
//        mainMenuButton.click()
//        newCar.click()
//        newCycle.click()
//        clickOnDiagram(523, 171)
//        at BodyPage
//        $("#CarBodyTypeNext").click()
//        clickOnDiagram(364, 198)
//        at PersonPage
//        $("#CarCrewChange").click()
//        assert js."CWD.state.car.car.crew.length" == 2
//        assert js."CWD.state.car.crew.length" == 2
//        assert js."CWD.state.car.crew[0].x" > 100
//        assert js."CWD.state.car.crew[0].y" > 100
//        assert js."CWD.state.car.crew[0].w" > 50
//        assert js."CWD.state.car.crew[0].h" > 50
//        assert js."CWD.state.car.crew[1].x" > 100
//        assert js."CWD.state.car.crew[1].y" > 100
//        assert js."CWD.state.car.crew[1].w" > 50
//        assert js."CWD.state.car.crew[1].h" > 50
//    }
//
//    @Test
//    public void testRemoveSidecarGunner() {
//        go()
//        at DefaultPage
//        mainMenuButton.click()
//        newCar.click()
//        newCycle.click()
//        clickOnDiagram(523, 171)
//        at BodyPage
//        $("#CarBodyTypeNext").click()
//        $("#CarSidecarTypeNext").click()
//        toolbarCrewButton.click()
//        $("#CarCrewOutsideGunner").click()
//        assert js."CWD.state.car.car.sidecar.crew.length" == 1
//        assert js."CWD.state.car.sidecarCrew.length" == 1
//        at PersonPage
//        $("#CarCrewChange").click()
//        at DefaultPage
//        assert js."CWD.state.car.car.sidecar.crew.length" == 0
//        assert js."CWD.state.car.sidecarCrew.length" == 0
//    }
//
//    @Test
//    public void removeWeaponFromOversizeSideTurrets() {
//        go()
//        at DefaultPage
//        mainMenuButton.click()
//        $("#CarMenuNewCar").click()
//        at NewVehiclePage
//        clickOnDiagram(372, 470)
//        assert modelIsOversize()
//        clickToolbarTurret()
//        at TurretLocationsPage
//        $("#CarTurretSideBackLink").click()
//        at TurretListPage
//        $("#CarTurretListSideSponson").click()
//        at TurretPage
//        $("#CarTurretWeaponAdd").click()
//        at WeaponCategoriesPage
//        $("#CarWeaponCategorySBP").click()
//        at WeaponListPage
//        assert $("#CarWeaponListLink1").text() =~ "^Machine Gun"
//        $("#CarWeaponListLink1").click()
//        at WeaponPage
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 1
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons[0].count" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons[0].count" == 1
//        $("#CarWeaponCountNext").click()
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 2
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 2
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons[0].count" == 2
//        assert js."CWD.state.car.car.rightBackTurret.weapons[0].count" == 2
//        $("#CarWeaponCountNext").click()
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 3
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 3
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons[0].count" == 3
//        assert js."CWD.state.car.car.rightBackTurret.weapons[0].count" == 3
//        $("#CarWeaponCountNext").click()
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 4
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 4
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons[0].count" == 4
//        assert js."CWD.state.car.car.rightBackTurret.weapons[0].count" == 4
//        $("#CarWeaponCountPrev").click()
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 3
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 3
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons[0].count" == 3
//        assert js."CWD.state.car.car.rightBackTurret.weapons[0].count" == 3
//        $("#CarWeaponCountPrev").click()
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 2
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 2
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons[0].count" == 2
//        assert js."CWD.state.car.car.rightBackTurret.weapons[0].count" == 2
//        $("#CarWeaponCountPrev").click()
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 1
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 1
//        assert js."CWD.state.car.car.leftBackTurret.weapons[0].count" == 1
//        assert js."CWD.state.car.car.rightBackTurret.weapons[0].count" == 1
//        $("#CarWeaponCountPrev").click()
//        assert js."CWD.state.car.leftBackTurretWeapons.length" == 0
//        assert js."CWD.state.car.rightBackTurretWeapons.length" == 0
//        assert js."CWD.state.car.car.leftBackTurret.weapons.length" == 0
//        assert js."CWD.state.car.car.rightBackTurret.weapons.length" == 0
//        at TurretPage
//    }
}
