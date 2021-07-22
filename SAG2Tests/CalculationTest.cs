using System;
using System.Collections.Generic;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using NUnit.Framework;

namespace SAG2Tests
{
    abstract public class CalculationTest
    {
        protected IWebDriver driver = new ChromeDriver();
        protected float mass, gripReference, centerOfMass, leverReference, bladeNode, actionPoint1, pivotPoint1, actionPoint2, pivotPoint2;
        protected float comToActionPoint1, comToActionPoint2, comToPivotPoint1, comToPivotPoint2, comToCross, comToHandle, j1, j2, widthOfOval, heightOfOval, angleOfCone, degrees, cuttingPotential;
        protected float c = 0.2f;

        protected string expectedName;
        protected float expectedMass, expectedGripReference, expectedCenterOfMass, expectedLeverReference, expectedHiltNode, expectedBladeNode, expectedActionPoint1, expectedPivotPoint1,
                        expectedActionPoint2, expectedPivotPoint2, expectedOverallLength;

        [SetUp]
        public abstract void Initialize();

        [Test]
        public void ExecuteTest()
        {
            logInAndCreateSword();
            checkCalculations();
            restOfTheTest();
        }

        [TearDown]
        public void CleanUp()
        {
            clickControl(driver, "#back");
            clickControl(driver, "a[href*='Delete']");
            clickControl(driver, "input[type='submit']");
            driver.Close();
        }

        public void setParameters(string name, float mass, float gripReference, float centerOfMass, float leverReference, float hiltNode, float bladeNode, float actionPoint1,
                                  float pivotPoint1, float actionPoint2, float pivotPoint2, float overallLength)
        {
            expectedName = name;
            expectedMass = mass;
            expectedGripReference = gripReference;
            expectedCenterOfMass = centerOfMass;
            expectedLeverReference = leverReference;
            expectedHiltNode = hiltNode;
            expectedBladeNode = bladeNode;
            expectedActionPoint1 = actionPoint1;
            expectedPivotPoint1 = pivotPoint1;
            expectedActionPoint2 = actionPoint2;
            expectedPivotPoint2 = pivotPoint2;
            expectedOverallLength = overallLength;
        }

        public void logInAndCreateSword()
        {
            // Login values
            var login = "Test";
            var password = "Pass-1";

            // login
            clickControl(driver, "a[href='/Identity/Account/Login']");
            sendKeyControl(driver, "#Input_Login", login);
            sendKeyControl(driver, "#Input_Password", password);
            clickControl(driver, "button[type='submit']");

            //create sword
            clickControl(driver, "a[href='/Swords/Create']");
            sendKeyControl(driver, "#Sword_Name", expectedName);
            sendKeyControl(driver, "#Sword_Mass", expectedMass.ToString());
            sendKeyControl(driver, "#Sword_GripReference", expectedGripReference.ToString());
            sendKeyControl(driver, "#Sword_CenterOfMass", expectedCenterOfMass.ToString());
            sendKeyControl(driver, "#Sword_LeverReference", expectedLeverReference.ToString());
            sendKeyControl(driver, "#Sword_HiltNode", expectedHiltNode.ToString());
            sendKeyControl(driver, "#Sword_BladeNode", expectedBladeNode.ToString());
            sendKeyControl(driver, "#Sword_ActionPoint1", expectedActionPoint1.ToString());
            sendKeyControl(driver, "#Sword_PivotPoint1", expectedPivotPoint1.ToString());
            sendKeyControl(driver, "#Sword_ActionPoint2", expectedActionPoint2.ToString());
            sendKeyControl(driver, "#Sword_PivotPoint2", expectedPivotPoint2.ToString());
            sendKeyControl(driver, "#Sword_OverallLength", expectedOverallLength.ToString());
            clickControl(driver, "input[type='submit']");
        }

        public void checkCalculations()
        {
            // calculate
            mass = scaleInput(expectedMass, 1000);
            gripReference = scaleInput(expectedGripReference);
            centerOfMass = scaleInput(expectedCenterOfMass);
            leverReference = scaleInput(expectedLeverReference);
            bladeNode = scaleInput(expectedBladeNode);
            actionPoint1 = scaleInput(expectedActionPoint1);
            pivotPoint1 = scaleInput(expectedPivotPoint1);
            actionPoint2 = scaleInput(expectedActionPoint2);
            pivotPoint2 = scaleInput(expectedPivotPoint2);

            calculate();

            // expected values
            string expectedCuttingPotential = getExpected(cuttingPotential);
            string expectedInertiaX = getExpected(widthOfOval);
            string expectedInertiaY = getExpected(heightOfOval);
            string expectedManeuverability = Convert.ToSingle(Math.Round(degrees, 2)).ToString().Replace(",", ".");

            // get received values
            clickControl(driver, "a[href*='Edit']");

            string receivedCuttingPotential = getText(driver, "#cuttingPotential");
            string receivedInertiaX = getText(driver, "#inertiaX");
            string receivedInertiaY = getText(driver, "#inertiaY");
            string receivedManeuverability = getText(driver, "#maneuverability");

            // test calculations
            Assert.AreEqual(expectedCuttingPotential, receivedCuttingPotential);
            Assert.AreEqual(expectedInertiaX, receivedInertiaX);
            Assert.AreEqual(expectedInertiaY, receivedInertiaY);
            Assert.AreEqual(expectedManeuverability, receivedManeuverability);
        }

        public abstract void restOfTheTest();


        public static void sendKeyControl(IWebDriver driver, string by, string value)
        {
            IWebElement element = driver.FindElement(By.CssSelector(by));
            element.SendKeys(value);
        }

        public static void clickControl(IWebDriver driver, string by)
        {
            IWebElement element = driver.FindElement(By.CssSelector(by));
            element.Click();
        }

        public static string getText(IWebDriver driver, string by)
        {
            IWebElement element = driver.FindElement(By.CssSelector(by));
            return element.Text;
        }


        private float scaleInput(float value, float scale = 100)
        {
            return value / scale;
        }

        private float countComToActionPoint(float actionPoint)
        {
            return centerOfMass - actionPoint;
        }

        private float countComToPivotPoint(float pivotPoint)
        {
            return pivotPoint - centerOfMass;
        }

        private void countComToCross()
        {
            comToCross = centerOfMass - gripReference;
        }

        private void countComToHandle()
        {
            comToHandle = centerOfMass - leverReference;
        }

        private float countJ(float comToActionPoint, float comToPivotPoint)
        {
            return comToActionPoint * comToPivotPoint + Convert.ToSingle(Math.Pow(comToCross, 2));
        }

        private void countWidthOfOval()
        {
            widthOfOval = c / mass;
        }

        private void countHeightOfOval()
        {
            heightOfOval = (countOneHeightOfOval(j1, comToActionPoint1, comToPivotPoint1) + countOneHeightOfOval(j2, comToActionPoint2, comToPivotPoint2)) / 2;
        }

        private void countAngleOfCone()
        {
            angleOfCone = (countOneAngleOfCone(j1) + countOneAngleOfCone(j2)) / 2;
        }

        private void countDegrees()
        {
            degrees = angleOfCone * 180 / (float)Math.PI;
        }

        private float countOneHeightOfOval(float j, float comToActionPoint, float comToPivotPoint)
        {
            var heightOfOval = ((widthOfOval * j) / (comToActionPoint * comToPivotPoint));
            return heightOfOval;
        }

        private float countOneAngleOfCone(float j)
        {
            var angleOfCone = widthOfOval * comToHandle / j;
            return angleOfCone;
        }

        private float countMass(float x, float comToActionPoint, float comToPivotPoint)
        {
            var y = mass - ((mass * x) / (comToActionPoint * comToPivotPoint + x));
            return y;
        }

        private void countCuttingPotential()
        {
            var x = Convert.ToSingle(Math.Pow(centerOfMass - bladeNode, 2));
            var mass1 = countMass(x, comToActionPoint1, comToPivotPoint1);
            var mass2 = countMass(x, comToActionPoint2, comToPivotPoint2);
            cuttingPotential = ((mass1 + mass2) / 2) / mass;
        }

        private string getExpected(float x)
        {
            return Convert.ToSingle(Math.Round(x * 100, 2)).ToString().Replace(",", ".");
        }

        private void calculate()
        {
            comToActionPoint1 = countComToActionPoint(actionPoint1);
            comToPivotPoint1 = countComToPivotPoint(pivotPoint1);
            comToActionPoint2 = countComToActionPoint(actionPoint2);
            comToPivotPoint2 = countComToPivotPoint(pivotPoint2);
            countComToCross();
            countComToHandle();
            j1 = countJ(comToActionPoint1, comToPivotPoint1);
            j2 = countJ(comToActionPoint2, comToPivotPoint2);
            countWidthOfOval();
            countHeightOfOval();
            countAngleOfCone();
            countDegrees();
            countCuttingPotential();
        }
    }
}
