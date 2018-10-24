module.exports = class VarInt {

  encode(numbers) {
    let $buffer = [];
    numbers.forEach($num => {
      if ($num === 0) {
        $buffer.push(0);
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


        $buffer.push(...$bytes);
      }
    });

    return $buffer;
  }

  decode(code) {
    let $shift = 0;
    let $result = 0;
    let $return = [];

    new Buffer(code, 'base64').forEach($i => {
      $result |= ($i & 0x7f) << $shift;
      $shift += 7;
      if (!($i & 0x80)) {
        $return.push($result);
        $result = 0;
        $shift = 0;
      }
    });

    return $return;
  }
};
