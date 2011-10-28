#!/usr/bin/perl

$line = <STDIN>;
print $line;

my @rows = ();

while(<STDIN>)
{
    chomp;
    @line = split(/,/, $_);
    push @rows, [@line];
}

sub mycmp
{
    if ($a->[0] != $b->[0])
    {
        return $a->[0] - $b->[0];
    }
    if ($a->[2] != $b->[2])
    {
        return $a->[2] - $b->[2];
    }
    $a->[3] =~ /([0-9]+)/;
    $n1 = $1;
    $b->[3] =~ /([0-9]+)/;
    $n2 = $1;
    if ($n1 != $n2)
    {
        return $n1 - $n2;
    }
    return $a->[1] cmp $b->[1];
}
#@result = sort {$causeRank{$a->[1]} <=> $causeRank{$b->[1]} } @rows;
@result = sort mycmp @rows;

foreach ( @result)
{
    print $_->[0].",".$_->[1].",".$_->[2].",".$_->[3].",".$_->[4]."\n";
}
