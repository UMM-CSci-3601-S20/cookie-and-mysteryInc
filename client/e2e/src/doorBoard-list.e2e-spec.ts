import {DoorBoardPage} from './doorBoard-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('DoorBoard list', () => {
  let page: DoorBoardPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new DoorBoardPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getDoorBoardTitle()).toEqual('Search DoorBoards');
  });

  it('Should type something in the name filter and check that it returned correct elements', async () => {
    await page.typeInput('doorBoard-name-input', 'Prospero Bruce');
    page.getDoorBoardListItems().each(e => {
      expect(e.element(by.className('doorBoard-list-name')).getText()).toEqual('Prospero Bruce');
    });
  });

  it('Should type something in the building filter and check that it returned correct elements', async () => {
    await page.typeInput('doorBoard-building-input', 'White House');
    page.getDoorBoardListItems().each(e => {
      expect(e.element(by.className('doorBoard-list-building')).getText()).toEqual('White House');
    });
  });



  it('Should type something partial in the company filter and check that it returned correct elements', async () => {
    await page.typeInput('doorBoard-building-input', 'House');

    // Go through each of the cards that are being shown and get the buildings
    const buildings = await page.getDoorBoardListItems().map(e => e.element(by.className('doorBoard-list-building')).getText());

    // We should see these buildings
    expect(buildings).toContain('White House');
    expect(buildings).toContain('Dancing House');
  });


  // it('Should click on a doorBoard and go to the correct URL', async () => {
  //   const doorBoardOneName = await page.getDoorBoardListItems().map(e => e.element(by.className('doorBoard-list-name')).getText());
  //   const doorBoardOneBuilding = await page.getDoorBoardListItems().map(e => e.element(by.className('doorBoard-list-building')).getText());

  //   await page.clickViewDoorBoard();

  //   // Wait until the URL contains 'doorBoards/' (note the ending slash)
  //   await browser.wait(EC.urlContains('doorBoards/'), 10000);

  //   // When the view profile button on the first doorBoard card is clicked, the URL should have a valid mongo ID
  //   const url = await page.getUrl();
  //   expect(RegExp('.*\/doorBoards\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);
  // });
});
