module.exports = class VarInt {

  encode(numbers) {
    let $buffer = [];
    numbers.forEach($num => {
      if ($num === 0) {
        $buffer.push(String.fromCharCode(0));
      } else {
        let $bytes = [];

        while ($num !== 0) {
          let $b = $num & 0x7f;
          $num >>= 7;
          if ($num !== 0) {
            $b |= 0x80;
          }
          $bytes.push($b);
        }

        $bytes[$bytes.length - 1] &= 0x7f;

        let $bytesStr = "";
        $bytes.forEach(item => {
          $bytesStr += String.fromCharCode(item)
        });

        $buffer.push($bytesStr);
      }
    });

    return $buffer.join("");
  }
};
