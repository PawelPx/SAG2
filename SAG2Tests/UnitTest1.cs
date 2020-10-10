using NUnit.Framework;
using System;
using System.Data;
using System.Data.SqlClient;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace SAG2Tests
{
    public class Tests
    {
        IWebDriver driver = new ChromeDriver();
        float mass, gripReference, centerOfMass, leverReference, bladeNode, actionPoint1, pivotPoint1, actionPoint2, pivotPoint2;
        float comToHandlePivot1, comToHandlePivot2, comToBladePivot1, comToBladePivot2, comToCross, handleLength, j1, j2, widthOfOval, heightOfOval, angleOfCone, degrees;
        float c = 0.2f;
        float cuttingPotential;

        [SetUp]
        public void Initialize()
        {
            driver.Navigate().GoToUrl("https://localhost:44316/");
            driver.Manage().Window.Maximize();
        }

        [Test]
        public void ExecuteTest()
        {
            // Login values
            var login = "Test";
            var password = "Pass-1";

            // expected values
            var expectedName = "Sword";
            var expectedMass = 1400;
            var expectedGripReference = 22;
            var expectedCenterOfMass = 33;
            var expectedLeverReference = 6;
            var expectedHiltNode = 16;
            var expectedBladeNode = 80;
            var expectedActionPoint1 = 21;
            var expectedPivotPoint1 = 98;
            var expectedActionPoint2 = 8;
            var expectedPivotPoint2 = 70;
            var expectedOverallLength = 112;

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

            // check what's in database
            string query = "Select top 1 * from Sword order by Id desc";
            var result = getQueryResult(query);

            // received values
            string receivedName = result.Rows[0]["Name"].ToString();
            float receivedMass = float.Parse(result.Rows[0]["Mass"].ToString());
            float receivedGripReference = float.Parse(result.Rows[0]["GripReference"].ToString());
            float receivedCenterOfMass = float.Parse(result.Rows[0]["CenterOfMass"].ToString());
            float receivedLeverReference = float.Parse(result.Rows[0]["LeverReference"].ToString());
            float receivedHiltNode = float.Parse(result.Rows[0]["HiltNode"].ToString());
            float receivedBladeNode = float.Parse(result.Rows[0]["BladeNode"].ToString());
            float receivedActionPoint1 = float.Parse(result.Rows[0]["ActionPoint1"].ToString());
            float receivedPivotPoint1 = float.Parse(result.Rows[0]["PivotPoint1"].ToString());
            float receivedActionPoint2 = float.Parse(result.Rows[0]["ActionPoint2"].ToString());
            float receivedPivotPoint2 = float.Parse(result.Rows[0]["PivotPoint2"].ToString());
            float receivedOverallLength = float.Parse(result.Rows[0]["OverallLength"].ToString());

            // test Db
            Assert.AreEqual(expectedName, receivedName);
            Assert.AreEqual(expectedMass, receivedMass);
            Assert.AreEqual(expectedGripReference, receivedGripReference);
            Assert.AreEqual(expectedCenterOfMass, receivedCenterOfMass);
            Assert.AreEqual(expectedLeverReference, receivedLeverReference);
            Assert.AreEqual(expectedHiltNode, receivedHiltNode);
            Assert.AreEqual(expectedBladeNode, receivedBladeNode);
            Assert.AreEqual(expectedActionPoint1, receivedActionPoint1);
            Assert.AreEqual(expectedPivotPoint1, receivedPivotPoint1);
            Assert.AreEqual(expectedActionPoint2, receivedActionPoint2);
            Assert.AreEqual(expectedPivotPoint2, receivedPivotPoint2);
            Assert.AreEqual(expectedOverallLength, receivedOverallLength);

            // calculate
            mass = (float)expectedMass / 1000;
            gripReference = (float)expectedGripReference / 100;
            centerOfMass = (float)expectedCenterOfMass / 100;
            leverReference = (float)expectedLeverReference / 100;
            bladeNode = (float)expectedBladeNode / 100;
            actionPoint1 = (float)expectedActionPoint1 / 100;
            pivotPoint1 = (float)expectedPivotPoint1 / 100;
            actionPoint2 = (float)expectedActionPoint2 / 100;
            pivotPoint2 = (float)expectedPivotPoint2 / 100;

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

        [TearDown]
        public void CleanUp()
        {
            clickControl(driver, "#back");
            clickControl(driver, "a[href*='Delete']");
            clickControl(driver, "button[type='submit']");
            driver.Close();
        }



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

        public DataTable getQueryResult(String query)
        {
            SqlConnection Connection;  // It is for SQL connection
            DataSet ds = new DataSet();  // it is for store query result

            try
            {
                Connection = new SqlConnection(@"Server=DESKTOP-DVTFMOJ;Database=SAG2Db;Trusted_Connection=True;");  // Declare SQL connection with connection string 
                Connection.Open();

                SqlDataAdapter adp = new SqlDataAdapter(query, Connection);  // Execute query on database 
                adp.Fill(ds);  // Store query result into DataSet object   
                Connection.Close();  // Close connection 
                Connection.Dispose();   // Dispose connection
            }
            catch (Exception E)
            {
                Console.WriteLine("Error in getting result of query.");
                Console.WriteLine(E.Message);
                return new DataTable();
            }
            return ds.Tables[0];
        }


        private float countComToHandlePivot(float actionPoint)
        {
            return centerOfMass - actionPoint;
        }

        private float countComToBladePivot(float pivotPoint)
        {
            return pivotPoint - centerOfMass;
        }

        private void countComToCross()
        {
            comToCross = centerOfMass - gripReference;
        }

        private void countHandleLength()
        {
            handleLength = gripReference - leverReference;
        }

        private float countJ(float comToHandlePivot, float comToBladePivot)
        {
            return comToHandlePivot * comToBladePivot + Convert.ToSingle(Math.Pow(comToCross, 2));
        }

        private void countWidthOfOval()
        {
            widthOfOval = c / mass;
        }

        private void countHeightOfOval()
        {
            heightOfOval = (countOneHeightOfOval(j1, comToHandlePivot1, comToBladePivot1) + countOneHeightOfOval(j2, comToHandlePivot2, comToBladePivot2)) / 2;
        }

        private void countAngleOfCone()
        {
            angleOfCone = (countOneAngleOfCone(j1) + countOneAngleOfCone(j2)) / 2;
        }

        private void countDegrees()
        {
            degrees = angleOfCone * 180 / (float)Math.PI;
        }

        private float countOneHeightOfOval(float j, float comToHandlePivot, float comToBladePivot)
        {
            var heightOfOval = ((widthOfOval * j) / (comToHandlePivot * comToBladePivot));
            return heightOfOval;
        }

        private float countOneAngleOfCone(float j)
        {
            var angleOfCone = widthOfOval * handleLength / j;
            return angleOfCone;
        }

        private float countMass(float x, float comToHandlePivot, float comToBladePivot)
        {
            var y = mass - ((mass * x) / (comToHandlePivot * comToBladePivot + x));
            return y;
        }

        private void countCuttingPotential()
        {
            var x = Convert.ToSingle(Math.Pow(centerOfMass - bladeNode, 2));
            var mass1 = countMass(x, comToHandlePivot1, comToBladePivot1);
            var mass2 = countMass(x, comToHandlePivot2, comToBladePivot2);
            cuttingPotential = ((mass1 + mass2) / 2) / mass;
        }

        private string getExpected(float x)
        {
            return Convert.ToSingle(Math.Round(x * 100, 2)).ToString().Replace(",", ".");
        }

        private void calculate()
        {
            comToHandlePivot1 = countComToHandlePivot(actionPoint1);
            comToBladePivot1 = countComToBladePivot(pivotPoint1);
            comToHandlePivot2 = countComToHandlePivot(actionPoint2);
            comToBladePivot2 = countComToBladePivot(pivotPoint2);
            countComToCross();
            countHandleLength();
            j1 = countJ(comToHandlePivot1, comToBladePivot1);
            j2 = countJ(comToHandlePivot2, comToBladePivot2);
            countWidthOfOval();
            countHeightOfOval();
            countAngleOfCone();
            countDegrees();
            countCuttingPotential();
        }
    }
}