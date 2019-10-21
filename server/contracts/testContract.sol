pragma solidity ^0.5.0;

// main Contract
contract testContract {

  uint public an_int;
  string public a_string;

  // struct aStruct {
  //   string name;
  //   bool status;
  // }

  uint[] public anArray;

  // get array length
  function getArrayLength() public view returns (uint) {
    return  anArray.length;
  }

  // change string
  function changeString(string memory _string) public {
    a_string = _string;
  }

  // change int
  function changeInt(uint _int) public {
    an_int = _int;
  }

  // Add a new element
  function addElementToArray(uint _element) public {
    anArray.push(_element);
  }

  // Remove an element
  function removeElementFromArray(uint _elementId) public {
    for (uint i = _elementId; i < anArray.length-1; i++){
      anArray[_elementId] = anArray[_elementId + 1];
    }
    anArray.length--;
  }
} // end of contract